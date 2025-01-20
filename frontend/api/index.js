require('dotenv').config()
const fs = require('fs')
const exphbs = require('express-handlebars')
const express = require('express')
const bodyParser = require('body-parser')
const pipedrive = require('pipedrive')
const spm = require('./middleware/single-page-middleware')
const path = require('path')
const app = express()
const dataRelay = require('data-relay/node')

const SLACK_TOKEN = process.env.SLACK_TOKEN
const slackClient = SLACK_TOKEN && require('./slack-client')

const postToSlack = process.env.VERCEL_ENV === 'production'

const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 8080

// Setup Pipedrive Client
const pipedriveDefaultClient = new pipedrive.ApiClient()
const pipedrivePersonsApi = new pipedrive.PersonsApi(pipedriveDefaultClient)
const pipedriveLeadsApi = new pipedrive.LeadsApi(pipedriveDefaultClient)
const pipedriveNotesApi = new pipedrive.NotesApi(pipedriveDefaultClient)
const pipedriveApiToken = pipedriveDefaultClient.authentications.api_key
pipedriveApiToken.apiKey = process.env.PIPEDRIVE_API_KEY

app.get('/config/project-overrides', (req, res) => {
  const getVariable = ({ name, value }) => {
    if (!value || value === 'undefined') {
      if (typeof value === 'boolean') {
        return `    ${name}: false,
                `
      }
      return ''
    }

    if (typeof value !== 'string') {
      return `    ${name}: ${value},
            `
    }

    return `    ${name}: '${value.trim()}',
        `
  }
  const envToBool = (name, defaultVal) => {
    const envVar = `${process.env[name]}`
    if (envVar === 'undefined') {
      return defaultVal
    }
    return envVar === 'true' || envVar === '1'
  }
  const sha = ''
  /*
    todo: implement across docker and vercel
    if (fs.existsSync(path.join(__dirname, 'CI_COMMIT_SHA'))) {
        sha = fs.readFileSync(path.join(__dirname, 'CI_COMMIT_SHA'));
    }
    */

  const values = [
    { name: 'preventSignup', value: envToBool('PREVENT_SIGNUP', false) },
    {
      name: 'preventEmailPassword',
      value: envToBool('PREVENT_EMAIL_PASSWORD', false),
    },
    {
      name: 'preventForgotPassword',
      value: envToBool('PREVENT_FORGOT_PASSWORD', false),
    },
    {
      name: 'superUserCreateOnly',
      value: envToBool('ONLY_SUPERUSERS_CAN_CREATE_ORGANISATIONS', false),
    },
    { name: 'flagsmith', value: process.env.FLAGSMITH_ON_FLAGSMITH_API_KEY },
    { name: 'heap', value: process.env.HEAP_API_KEY },
    { name: 'headway', value: process.env.HEADWAY_API_KEY },
    { name: 'ga', value: process.env.GOOGLE_ANALYTICS_API_KEY },
    { name: 'sha', value: sha },
    { name: 'mixpanel', value: process.env.MIXPANEL_API_KEY },
    { name: 'crispChat', value: process.env.CRISP_WEBSITE_ID },
    { name: 'fpr', value: process.env.FIRST_PROMOTER_ID },
    { name: 'zendesk', value: process.env.ZENDESK_WIDGET_ID },
    { name: 'sentry', value: process.env.SENTRY_API_KEY },
    {
      name: 'api',
      value: process.env.FLAGSMITH_PROXY_API_URL
        ? '/api/v1/'
        : process.env.FLAGSMITH_API_URL,
    },
    { name: 'maintenance', value: envToBool('ENABLE_MAINTENANCE_MODE', false) },
    {
      name: 'flagsmithClientAPI',
      value: process.env.FLAGSMITH_ON_FLAGSMITH_API_URL,
    },
    {
      name: 'disableAnalytics',
      value: envToBool('DISABLE_ANALYTICS_FEATURES', false),
    },
    {
      name: 'flagsmithAnalytics',
      value: envToBool('ENABLE_FLAG_EVALUATION_ANALYTICS', true),
    },
    {
      name: 'flagsmithRealtime',
      value: envToBool('ENABLE_FLAGSMITH_REALTIME', false),
    },
    { name: 'amplitude', value: process.env.AMPLITUDE_API_KEY },
    { name: 'delighted', value: process.env.DELIGHTED_API_KEY },
    { name: 'capterraKey', value: process.env.CAPTERRA_API_KEY },
    {
      name: 'hideInviteLinks',
      value: envToBool('DISABLE_INVITE_LINKS', false),
    },
    {
      name: 'linkedinPartnerTracking',
      value: envToBool('LINKEDIN_PARTNER_TRACKING', false),
    },
    { name: 'albacross', value: process.env.ALBACROSS_CLIENT_ID },
    { name: 'useSecureCookies', value: envToBool('USE_SECURE_COOKIES', false) },
    { name: 'cookieSameSite', value: process.env.COOKIE_SAME_SITE },
    { name: 'cookieAuthEnabled', value: process.env.COOKIE_AUTH_ENABLED },
    {
      name: 'githubAppURL',
      value: process.env.GITHUB_APP_URL,
    },
    {
      name: 'e2eToken',
      value: process.env.E2E_TEST_TOKEN || '',
    },
  ]
  let output = values.map(getVariable).join('')
  let dynatrace = ''
  if (process.env.DYNATRACE_URL) {
    dynatrace = `
window.enableDynatrace = true;
(function(){function va(){document.cookie="".concat("__dTCookie","=").concat("1",";SameSite=Lax");var ua=-1!==document.cookie.indexOf("__dTCookie");document.cookie="".concat("__dTCookie","=").concat("1","; expires=Thu, 01-Jan-1970 00:00:01 GMT");return ua}function Sa(){return void 0===eb.dialogArguments?navigator.cookieEnabled||va():va()}function fb(){var ua;if(Sa()&&!window.dT_){var kb=(ua={},ua.cfg="app=8e35f25923c61ac7|cors=1|featureHash=A2NVfqru|vcv=2|reportUrl=${process.env.DYNATRACE_URL}/bf|rdnt=1|uxrgce=1|bp=3|cuc=2zmvahr4|mel=100000|dpvc=1|ssv=4|lastModification=1688993944019|tp=500,50,0,1|featureHash=A2NVfqru|agentUri=https://js-cdn.dynatrace.com/jstag/17b5f18726d/ruxitagent_A2NVfqru_10269230615181503.js|auto=|domain=|rid=RID_|rpid=|app=8e35f25923c61ac7",ua.iCE=
            Sa,ua);window.dT_=kb}}this.dT_&&dT_.prm&&dT_.prm();var eb="undefined"!==typeof window?window:self,La;eb.dT_?(null===(La=eb.console)||void 0===La?void 0:La.log("Duplicate agent injection detected, turning off redundant initConfig."),eb.dT_.di=1):fb()})();
        (function(){function va(f,n,G){if(G||2===arguments.length)for(var F=0,Z=n.length,Da;F<Z;F++)!Da&&F in n||(Da||(Da=Array.prototype.slice.call(n,0,F)),Da[F]=n[F]);return f.concat(Da||Array.prototype.slice.call(n))}function Sa(f,n,G){void 0===G&&(G=0);var F=-1;n&&(null===f||void 0===f?0:f.indexOf)&&(F=f.indexOf(n,G));return F}function fb(){var f;return!(null===(f=Wa.console)||void 0===f||!f.log)}function eb(f,n){if(!n)return"";var G=f+"=";f=Sa(n,G);if(0>f)return"";for(;0<=f;){if(0===f||" "===n.charAt(f-
            1)||";"===n.charAt(f-1))return G=f+G.length,f=Sa(n,";",f),0<=f?n.substring(G,f):n.substring(G);f=Sa(n,G,f+G.length)}return""}function La(f){return eb(f,document.cookie)}function ua(){}function kb(){var f=0;try{f=Math.round(Wa.performance.timeOrigin)}catch(n){}if(0>=f||isNaN(f)||!isFinite(f)){Ha(Qd,{severity:"Warning",type:"ptoi",text:"performance.timeOrigin is invalid, with a value of [".concat(f,"]. Falling back to performance.timing.navigationStart")});f=0;try{f=Wa.performance.timing.navigationStart}catch(n){}f=
            0>=f||isNaN(f)||!isFinite(f)?Jd:f}ag=f;Bd=na;return ag}function na(){return ag}function Ta(){return Bd()}function Oa(){var f,n=0;if(null===(f=null===Wa||void 0===Wa?void 0:Wa.performance)||void 0===f?0:f.now)try{n=Math.round(Wa.performance.now())}catch(G){}return 0>=n||isNaN(n)||!isFinite(n)?(new Date).getTime()-Bd():n}function Za(f,n){void 0===n&&(n=document.cookie);return eb(f,n)}function Aa(){}function ja(f,n){return function(){f.apply(n,arguments)}}function ta(f){if(!(this instanceof ta))throw new TypeError("Promises must be constructed via new");
            if("function"!==typeof f)throw new TypeError("not a function");this.ka=0;this.ic=!1;this.qa=void 0;this.Fa=[];ra(f,this)}function Ia(f,n){for(;3===f.ka;)f=f.qa;0===f.ka?f.Fa.push(n):(f.ic=!0,ta.Fb(function(){var G=1===f.ka?n.Be:n.Ce;if(null===G)(1===f.ka?Ma:Ba)(n.promise,f.qa);else{try{var F=G(f.qa)}catch(Z){Ba(n.promise,Z);return}Ma(n.promise,F)}}))}function Ma(f,n){try{if(n===f)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"===typeof n||"function"===typeof n)){var G=
            n.then;if(n instanceof ta){f.ka=3;f.qa=n;N(f);return}if("function"===typeof G){ra(ja(G,n),f);return}}f.ka=1;f.qa=n;N(f)}catch(F){Ba(f,F)}}function Ba(f,n){f.ka=2;f.qa=n;N(f)}function N(f){2===f.ka&&0===f.Fa.length&&ta.Fb(function(){f.ic||ta.qc(f.qa)});for(var n=0,G=f.Fa.length;n<G;n++)Ia(f,f.Fa[n]);f.Fa=null}function la(f,n,G){this.Be="function"===typeof f?f:null;this.Ce="function"===typeof n?n:null;this.promise=G}function ra(f,n){var G=!1;try{f(function(F){G||(G=!0,Ma(n,F))},function(F){G||(G=!0,
            Ba(n,F))})}catch(F){G||(G=!0,Ba(n,F))}}function bb(){v.Fb=function(f){if("string"===typeof f)throw Error("Promise polyfill called _immediateFn with string");f()};v.qc=function(){};return v}function ab(f,n){return parseInt(f,n||10)}function fa(f){return document.getElementsByTagName(f)}function ea(f){return f.length}function Ha(f){for(var n=[],G=1;G<arguments.length;G++)n[G-1]=arguments[G];f.push.apply(f,n)}function Ea(f){f=encodeURIComponent(f);var n=[];if(f)for(var G=0;G<f.length;G++){var F=f.charAt(G);
            Ha(n,u[F]||F)}return n.join("")}function L(f){-1<Sa(f,"^")&&(f=f.split("^^").join("^"),f=f.split("^dq").join('"'),f=f.split("^rb").join(">"),f=f.split("^lb").join("<"),f=f.split("^p").join("|"),f=f.split("^e").join("="),f=f.split("^s").join(";"),f=f.split("^c").join(","),f=f.split("^bs").join("\\\\"));return f}function P(f,n){if(!f||!f.length)return-1;if(f.indexOf)return f.indexOf(n);for(var G=f.length;G--;)if(f[G]===n)return G;return-1}function Va(f,n){var G;void 0===n&&(n=[]);if(!f||"object"!==typeof f&&
            "function"!==typeof f)return!1;var F="number"!==typeof n?n:[],Z=null,Da=[];switch("number"===typeof n?n:5){case 1:Z="Boolean";break;case 2:Z="Number";break;case 3:Z="String";break;case 4:Z="Function";break;case 5:Z="Object";break;case 6:Z="Date";Da.push("getTime");break;case 7:Z="Error";Da.push("name","message");break;case 8:Z="Element";break;case 9:Z="HTMLElement";break;case 10:Z="HTMLImageElement";Da.push("complete");break;case 11:Z="PerformanceEntry";break;case 12:Z="PerformanceTiming";break;case 13:Z=
            "PerformanceResourceTiming";break;case 14:Z="PerformanceNavigationTiming";break;case 15:Z="CSSRule";Da.push("cssText","parentStyleSheet");break;case 16:Z="CSSStyleSheet";Da.push("cssRules","insertRule");break;case 17:Z="Request";Da.push("url");break;case 18:Z="Response";Da.push("ok","status","statusText");break;case 19:Z="Set";Da.push("add","entries","forEach");break;case 20:Z="Map";Da.push("set","entries","forEach");break;case 21:Z="Worker";Da.push("addEventListener","postMessage","terminate");break;
            case 22:Z="XMLHttpRequest";Da.push("open","send","setRequestHeader");break;case 23:Z="SVGScriptElement";Da.push("ownerSVGElement","type");break;case 24:Z="HTMLMetaElement";Da.push("httpEquiv","content","name");break;case 25:Z="HTMLHeadElement";break;case 26:Z="ArrayBuffer";break;case 27:Z="ShadowRoot",Da.push("host","mode")}n=Z;if(!n)return!1;Da=Da.length?Da:F;if(!F.length)try{if(Wa[n]&&f instanceof Wa[n]||Object.prototype.toString.call(f)==="[object "+n+"]")return!0;if(f&&f.nodeType&&1===f.nodeType){var Gb=
            null===(G=f.ownerDocument.defaultView)||void 0===G?void 0:G[n];if("function"===typeof Gb&&f instanceof Gb)return!0}}catch(Qb){}for(G=0;G<Da.length;G++)if(F=Da[G],"string"!==typeof F&&"number"!==typeof F&&"symbol"!==typeof F||!(F in f))return!1;return!!Da.length}function O(f,n,G,F){"undefined"===typeof F&&(F=T(n,!0));"boolean"===typeof F&&(F=T(n,F));f===Wa?S&&S(n,G,F):lb&&Va(f,21)?pb.call(f,n,G,F):f.addEventListener&&(f===Wa.document||f===Wa.document.documentElement?Na.call(f,n,G,F):S.call(f,n,G,F));
            F=!1;for(var Z=ob.length;0<=--Z;){var Da=ob[Z];if(Da.object===f&&Da.event===n&&Da.H===G){F=!0;break}}F||Ha(ob,{object:f,event:n,H:G})}function X(f,n,G,F){for(var Z=ob.length;0<=--Z;){var Da=ob[Z];if(Da.object===f&&Da.event===n&&Da.H===G){ob.splice(Z,1);break}}"undefined"===typeof F&&(F=T(n,!0));"boolean"===typeof F&&(F=T(n,F));f===Wa?ka&&ka(n,G,F):f.removeEventListener&&(f===Wa.document||f===Wa.document.documentElement?qb.call(f,n,G,F):ka.call(f,n,G,F))}function T(f,n){var G=!1;try{if(S&&-1<P(Zb,
            f)){var F=Object.defineProperty({},"passive",{get:function(){G=!0}});S("test",ua,F)}}catch(Z){}return G?{passive:!0,capture:n}:n}function pa(){for(var f=ob,n=f.length;0<=--n;){var G=f[n];X(G.object,G.event,G.H)}ob=[]}function ca(f){return"function"===typeof f&&/{\\s+\\[native code]/.test(Function.prototype.toString.call(f))}function Q(f,n){for(var G,F=[],Z=2;Z<arguments.length;Z++)F[Z-2]=arguments[Z];return void 0!==Function.prototype.bind&&ca(Function.prototype.bind)?(G=Function.prototype.bind).call.apply(G,
            va([f,n],F,!1)):function(){for(var Da=0;Da<arguments.length;Da++);return f.apply(n,(F||[]).concat(Array.prototype.slice.call(arguments)||[]))}}function ya(){if(Ac){var f=new Ac;if(Hc)for(var n=0,G=Qc;n<G.length;n++){var F=G[n];void 0!==Hc[F]&&(f[F]=Q(Hc[F],f))}return f}return new Wa.XMLHttpRequest}function gb(){document.cookie="".concat("__dTCookie","=").concat("1",";SameSite=Lax");var f=-1!==document.cookie.indexOf("__dTCookie");document.cookie="".concat("__dTCookie","=").concat("1","; expires=Thu, 01-Jan-1970 00:00:01 GMT");
            return f}function hb(){return void 0===Wa.dialogArguments?navigator.cookieEnabled||gb():gb()}function Ja(){return kc}function mb(f){kc=f}function zb(f){var n=Ga("rid"),G=Ga("rpid");n&&(f.rid=n);G&&(f.rpid=G)}function wb(f){if(f=f.xb){f=L(f);try{kc=new RegExp(f,"i")}catch(n){}}else kc=void 0}function Jb(f){return"n"===f||"s"===f||"l"===f?";SameSite=".concat(Kd[f]):""}function cb(f,n,G){var F=1,Z=0;do document.cookie=f+'=""'+(n?";domain="+n:"")+";path="+G.substring(0,F)+"; expires=Thu, 01 Jan 1970 00:00:01 GMT;",
            F=G.indexOf("/",F),Z++;while(-1!==F&&5>Z)}function Vb(){if(Wa.MobileAgent||Wa.dynatraceMobile){var f=La("dtAdkSettings");return Lb(f).privacyState||null}return null}function jb(f,n){return!Ob()||Wa.dT_.overloadPrevention&&!K()?null:f.apply(this,n||[])}function Ob(){var f=Vb();return 2===f||1===f?!1:!W("coo")||W("cooO")||K()}function Ab(f,n){try{Wa.sessionStorage.setItem(f,n)}catch(G){}}function xb(f,n){jb(Ab,[f,n])}function lc(f){try{return Wa.sessionStorage.getItem(f)}catch(n){}return null}function Tb(f){try{Wa.sessionStorage.removeItem(f)}catch(n){}}
            function vb(f){document.cookie=f+'="";path=/'+(Ga("domain")?";domain="+Ga("domain"):"")+"; expires=Thu, 01 Jan 1970 00:00:01 GMT;"}function Ec(f,n,G,F){n||0===n?(n=(n+"").replace(/[;\\n\\r]/g,"_"),f=f+"="+n+";path=/"+(Ga("domain")?";domain="+Ga("domain"):""),G&&(f+=";expires="+G.toUTCString()),f+=Jb(Ga("cssm")),F&&"https:"===location.protocol&&(f+=";Secure"),document.cookie=f):vb(f)}function cc(f,n,G,F){jb(Ec,[f,n,G,F])}function mc(f){return-1===Sa(f,"v_4")?!1:!0}function sb(f){f=Za("dtCookie",f);f||
            ((f=lc("dtCookie"))&&mc(f)?C(f):f="");return mc(f)?f:""}function C(f){cc("dtCookie",f,void 0,W("ssc"))}function r(f){return(f=f||sb())?Lb(f):{sessionId:"",serverId:"",overloadState:0,appState:{}}}function z(f){return r(f).serverId}function D(f){return r(f).sessionId}function K(){return 0<=Sa(navigator.userAgent,"RuxitSynthetic")}function E(f){var n={},G=0;for(f=f.split("|");G<f.length;G++){var F=f[G].split("=");2===F.length&&(n[F[0]]=decodeURIComponent(F[1].replace(/\\+/g," ")))}return n}function ba(){var f=
                Ga("csu");return(f.indexOf("dbg")===f.length-3?f.substring(0,f.length-3):f)+"_"+Ga("app")+"_Store"}function R(f,n,G){void 0===n&&(n={});var F=0;for(f=f.split("|");F<f.length;F++){var Z=f[F],Da=Z,Gb=Sa(Z,"=");-1===Gb?n[Da]="1":(Da=Z.substring(0,Gb),n[Da]=Z.substring(Gb+1,Z.length))}!G&&(G=n,F=G.spc)&&(f=document.createElement("textarea"),f.innerHTML=F,G.spc=f.value);return n}function ma(f){var n;return null!==(n=Db[f])&&void 0!==n?n:Xc[f]}function W(f){f=ma(f);return"false"===f||"0"===f?!1:!!f}function oa(f){var n=
                ma(f);n=ab(n);isNaN(n)&&(n=Xc[f]);return n}function Ga(f){return(ma(f)||"")+""}function Cb(f,n){Db[f]=n+""}function Eb(f){return Db=f}function qc(f){Db[f]=0>Sa(Db[f],"#"+f.toUpperCase())?Db[f]:""}function yc(f){var n=f.agentUri;n&&-1<Sa(n,"_")&&(n=/([a-zA-Z]*)[0-9]{0,4}_([a-zA-Z_0-9]*)_[0-9]+/g.exec(n))&&n.length&&2<n.length&&(f.csu=n[1],f.featureHash=n[2])}function tc(f){var n=f.domain||"";var G=(G=location.hostname)&&n?G===n||-1!==G.indexOf("."+n,G.length-("."+n).length):!0;if(!n||!G){f.domainOverride||
            (f.domainOriginal=f.domain||"",f.domainOverride="".concat(location.hostname,",").concat(n),delete f.domain);var F=Ga("cssm");var Z=document.domain||"";if(Z){Z=Z.split(".").reverse();var Da=Z.length;if(1>=Da)F="";else{for(var Gb=Z[0],Qb="",hc=1;hc<=Da;hc++)if(Za("dTValidationCookie")){Qb=Gb;break}else{Z[hc]&&(Gb="".concat(Z[hc],".").concat(Gb));var xc="".concat("dTValidationCookie","=dTValidationCookieValue;path=/;domain=").concat(Gb);xc+=Jb(F);document.cookie=xc}cb("dTValidationCookie",Qb,"/");F=
                Qb}}else F="";F&&(f.domain=F);G||Ha(Qd,{type:"dpi",severity:"Warning",text:'Configured domain "'.concat(n,'" is invalid for current location "').concat(location.hostname,'". Agent will use "').concat(f.domain,'" instead.')})}}function zc(f,n){tc(f);var G=Db.pVO;G&&(f.pVO=G);n||(f.bp=(f.bp||Xc.bp)+"")}function ud(){return Db}function md(f){return Xc[f]===ma(f)}function Lb(f){var n,G={},F={sessionId:"",serverId:"",overloadState:0,appState:G},Z=f.split("_");if(2<Z.length&&0===Z.length%2){f=+Z[1];if(isNaN(f)||
                3>f)return F;f={};for(var Da=2;Da<Z.length;Da++){var Gb=Z[Da];0===Sa(Gb,Be)?G[Gb.substring(6).toLowerCase()]=+Z[Da+1]:f[Gb]=Z[Da+1];Da++}f.sn?(Z=f.sn,Z=Z.length===Od||12>=Z.length?Z:""):Z="hybrid";F.sessionId=Z;if(f.srv){a:{Z=f.srv.replace("-2D","-");if(!isNaN(+Z)&&(Da=ab(Z),-99<=Da&&99>=Da))break a;Z=""}F.serverId=Z}Z=+f.ol;1===Z&&Rb(K());0<=Z&&2>=Z&&(F.overloadState=Z);f=+f.prv;isNaN(f)||(F.privacyState=1>f||4<f?1:f);f=null===(n=Ga("app"))||void 0===n?void 0:n.toLowerCase();n=G[f];isNaN(n)||0!==
            n||Rb(K())}return F}function Rb(f){var n=Wa.dT_;f||(n.disabled=!0,n.overloadPrevention=!0)}function nc(){return Kc()}function Bb(f,n){function G(){delete he[Da];f.apply(this,arguments)}for(var F=[],Z=2;Z<arguments.length;Z++)F[Z-2]=arguments[Z];if("apply"in Zd){F.unshift(G,n);var Da=Zd.apply(Wa,F)}else Da=Zd(G,n);he[Da]=!0;return Da}function ec(f){delete he[f];"apply"in Cd?Cd.call(Wa,f):Cd(f)}function Yc(f){Ha(Oe,f)}function Lc(f){for(var n=Oe.length;n--;)if(Oe[n]===f){Oe.splice(n,1);break}}function wc(){return Oe}
            function Rd(f,n){return Ce(f,n)}function rd(f){vd(f)}function xa(f,n){if(!xf||!sd)return"";f=new xf([f],{type:n});return sd(f)}function H(f,n){return wd?new wd(f,n):void 0}function ia(f){"function"===typeof f&&Ha(bg,f)}function wa(){return bg}function za(){return Jd}function Ca(f){return function(){for(var n=[],G=0;G<arguments.length;G++)n[G]=arguments[G];if("number"!==typeof n[0]||!he[n[0]])try{return f.apply(this,n)}catch(F){return f(n[0])}}}function Pa(){return Qd}function sa(){Bd=kb;Wa.performance&&
            (Kc=function(){return Math.round(Bd()+Oa())});if(!Kc||isNaN(Kc())||0>=Kc()||!isFinite(Kc()))Kc=function(){return(new Date).getTime()}}function Ka(){De&&(Wa.clearTimeout=Cd,Wa.clearInterval=vd,De=!1)}function ib(f,n){try{Wa.localStorage.setItem(f,n)}catch(G){}}function $a(f){try{Wa.localStorage.removeItem(f)}catch(n){}}function nb(f){try{return Wa.localStorage.getItem(f)}catch(n){}return null}function pc(){$a("rxvisitid");$a("rxvt")}function Wb(f){Ob()?f():(Ee||(Ee=[]),Ha(Ee,f))}function Nb(f){return jb(f)}
            function dc(){if(W("coo")&&!Ob()){for(var f=0,n=Ee;f<n.length;f++)Bb(n[f],0);Ee=[];Cb("cooO",!0)}}function Rc(){if(W("coo")&&Ob()){Cb("cooO",!1);vb("dtCookie");vb("dtPC");vb("dtSa");vb("dtAdk");vb("rxVisitor");vb("rxvt");try{Tb("rxvisitid"),Tb("rxvt"),pc(),Tb("rxVisitor"),Tb("dtCookie"),$a(ba()),$a("dtAdk")}catch(f){}}}function uc(f,n){void 0===n&&(n=document.cookie||"");return n.split(f+"=").length-1}function jc(f,n){var G=uc(f,n);if(1<G){n=Ga("domain")||Wa.location.hostname;var F=Wa.location.hostname,
                Z=Wa.location.pathname,Da=0,Gb=0;fd.push(f);do{var Qb=F.substring(Da);if(Qb!==n||"/"!==Z){cb(f,Qb===n?"":Qb,Z);var hc=uc(f);hc<G&&(fd.push(Qb),G=hc)}Da=F.indexOf(".",Da)+1;Gb++}while(0!==Da&&10>Gb&&1<G);Ga("domain")&&1<G&&cb(f,"",Z)}}function Tc(){var f=document.cookie;jc("dtPC",f);jc("dtCookie",f);jc("rxvt",f);0<fd.length&&Ha(Qd,{severity:"Error",type:"dcn",text:"Duplicate cookie name".concat(1!==fd.length?"s":""," detected: ").concat(fd.join(", "))})}function Pe(){Tc();Yc(function(f,n,G,F){0<fd.length&&
            !n&&(f.av(F,"dCN",fd.join(",")),fd=[]);0<$d.length&&!n&&(f.av(F,"eCC",$d.join(",")),$d=[])})}function Dd(f){var n=f,G=Math.pow(2,32);return function(){n=(1664525*n+1013904223)%G;return n/G}}function Mc(f,n){return isNaN(f)||isNaN(n)?Math.floor(33*ie()):Math.floor(ie()*(n-f+1))+f}function ed(f){if(!f)return"";var n=Wa.crypto||Wa.msCrypto;if(n&&-1===Sa(navigator.userAgent,"Googlebot"))n=n.getRandomValues(new Uint8Array(f));else{n=[];for(var G=0;G<f;G++)n.push(Mc(0,32))}f=[];for(G=0;G<n.length;G++){var F=
                Math.abs(n[G]%32);f.push(String.fromCharCode(F+(9>=F?48:55)))}return f.join("")}function bd(){return Fe}function gd(f){void 0===f&&(f=!0);Qe=f}function Cc(f,n,G){var F=oa("pcl");F=f.length-F;0<F&&f.splice(0,F);F=z(Za("dtCookie",G));for(var Z=[],Da=F?"".concat(F,"$"):"",Gb=0;Gb<f.length;Gb++){var Qb=f[Gb];"-"!==Qb.D&&Z.push("".concat(Da).concat(Qb.frameId,"h").concat(Qb.D))}f=Z.join("p");f||(Qe&&(kd(!0,"a",G),gd(!1)),f+="".concat(F,"$").concat(Fe,"h-"));f+="v".concat(n||ae(G));cc("dtPC",f+"e0",void 0,
                W("ssc"))}function Ed(f,n){void 0===n&&(n=document.cookie);var G=Za("dtPC",n);n=[];if(G&&"-"!==G){var F="";var Z=0;for(G=G.split("p");Z<G.length;Z++){var Da=G[Z],Gb=F,Qb=f;void 0===Gb&&(Gb="");F=Sa(Da,"$");var hc=Sa(Da,"h");var xc=Sa(Da,"v"),cd=Sa(Da,"e");F=Da.substring(F+1,hc);hc=-1!==xc?Da.substring(hc+1,xc):Da.substring(hc+1);Gb||-1===xc||(Gb=-1!==cd?Da.substring(xc+1,cd):Da.substring(xc+1));Da=null;Qb||(Qb=ab(F.split("_")[0]),xc=Kc()%mg,xc<Qb&&(xc+=mg),Qb=Qb+9E5>xc);Qb&&(Da={frameId:F,D:"-"===
                hc?"-":ab(hc),visitId:""});F=Gb;(hc=Da)&&n.push(hc)}for(f=0;f<n.length;f++)n[f].visitId=F}return n}function Fd(f,n){var G=document.cookie;n=Ed(n,G);for(var F=!1,Z=0;Z<n.length;Z++){var Da=n[Z];Da.frameId===Fe&&(Da.D=f,F=!0)}F||Ha(n,{frameId:Fe,D:f,visitId:""});Cc(n,void 0,G)}function ae(f){return Gd(f)||kd(!0,"c",f)}function Gd(f){if(Qa(f)<=Kc())return kd(!0,"t",f);var n=td(f);if(!n)return kd(!0,"c",f);var G=Zg.exec(n);if(!G||3!==G.length||32!==G[1].length||isNaN(ab(G[2])))return kd(!0,"i",f);xb("rxvisitid",
                n);return n}function be(f,n){var G=Kc();n=qa(n).Ec;f&&(n=G);M(G+cg+"|"+n);x()}function ef(f){var n="t"+(Kc()-Qa(f)),G=td(f),F=Sc();nd(F,f);p(F,n,G)}function td(f){var n,G;return null!==(G=null===(n=Ed(!0,f)[0])||void 0===n?void 0:n.visitId)&&void 0!==G?G:lc("rxvisitid")}function Sc(){var f=ed(Od);try{f=f.replace(/[0-9]/g,function(n){n=.1*ab(n);return String.fromCharCode(Math.floor(25*n+65))})}catch(n){throw Va(n,7),n;}return f+"-0"}function nd(f,n){var G=Ed(!1,n);Cc(G,f,n);xb("rxvisitid",f);be(!0)}
            function Sd(f,n,G){return kd(f,n,G)}function kd(f,n,G){f&&(Nf=!0);f=td(G);G=Sc();nd(G);p(G,n,f);return G}function p(f,n,G){if(td(document.cookie))for(var F=0,Z=ng;F<Z.length;F++)(0,Z[F])(f,Nf,n,G)}function w(f){ng.push(f)}function x(f){dg&&ec(dg);dg=Bb(J,Qa(f)-Kc())}function J(){var f=document.cookie;if(Qa(f)<=Kc())return jb(ef,[f]),!0;Wb(x);return!1}function M(f){var n=Q(cc,null,"rxvt",f,void 0,W("ssc"));n();var G=Za("rxvt");""!==G&&f!==G&&(Tc(),n(),f!==Za("rxvt")&&Ha(Qd,{severity:"Error",type:"dcn",
                text:"Could not sanitize cookies"}));xb("rxvt",f)}function Y(f,n){(n=Za(f,n))||(n=lc(f)||"");return n}function da(){var f=Gd()||"";xb("rxvisitid",f);f=Y("rxvt");M(f);pc()}function qa(f){var n={Ld:0,Ec:0};if(f=Y("rxvt",f))try{var G=f.split("|");2===G.length&&(n.Ld=parseInt(G[0]),n.Ec=parseInt(G[1]))}catch(F){}return n}function Qa(f){f=qa(f);return Math.min(f.Ld,f.Ec+Gg)}function Xa(f){cg=f}function ub(){var f=Nf;Nf=!1;return f}function Pb(){J()||be(!1)}function fc(){var f=Za("rxVisitor");f&&45===(null===
            f||void 0===f?void 0:f.length)||(f=nb("rxVisitor")||lc("rxVisitor"),45!==(null===f||void 0===f?void 0:f.length)&&(Hg=!0,f=Kc()+"",f+=ed(45-f.length)));gc(f);return f}function gc(f){if(W("dpvc")||W("pVO"))xb("rxVisitor",f);else{var n=new Date;var G=n.getMonth()+Math.min(24,Math.max(1,oa("rvcl")));n.setMonth(G);jb(ib,["rxVisitor",f])}cc("rxVisitor",f,n,W("ssc"))}function Uc(){return Hg}function od(f){var n=Za("rxVisitor");vb("rxVisitor");Tb("rxVisitor");$a("rxVisitor");Cb("pVO",!0);gc(n);f&&jb(ib,["dt-pVO",
                "1"]);da()}function Td(){$a("dt-pVO");W("pVO")&&(Cb("pVO",!1),fc());Tb("rxVisitor");da()}function Zc(f,n,G,F,Z){var Da=document.createElement("script");Da.setAttribute("src",f);n&&Da.setAttribute("defer","defer");G&&(Da.onload=G);F&&(Da.onerror=F);Z&&Da.setAttribute("id",Z);Da.setAttribute("crossorigin","anonymous");f=document.getElementsByTagName("script")[0];f.parentElement.insertBefore(Da,f)}function ad(f,n){return yf+"/"+(n||je)+"_"+f+"_"+(oa("buildNumber")||Wa.dT_.version)+".js"}function Of(){var f,
                n;try{null===(n=null===(f=Wa.MobileAgent)||void 0===f?void 0:f.incrementActionCount)||void 0===n?void 0:n.call(f)}catch(G){}}function Pf(){var f,n=Wa.dT_;Wa.dT_=(f={},f.di=0,f.version="10269230615181503",f.cfg=n?n.cfg:"",f.iCE=n?hb:function(){return navigator.cookieEnabled},f.ica=1,f.disabled=!1,f.overloadPrevention=!1,f.gAST=za,f.ww=H,f.stu=xa,f.nw=nc,f.apush=Ha,f.st=Bb,f.si=Rd,f.aBPSL=Yc,f.rBPSL=Lc,f.gBPSL=wc,f.aBPSCC=ia,f.gBPSCC=wa,f.buildType="dynatrace",f.gSSV=lc,f.sSSV=xb,f.rSSV=Tb,f.rvl=$a,f.pn=ab,
                f.iVSC=mc,f.p3SC=Lb,f.io=Sa,f.dC=vb,f.sC=cc,f.esc=Ea,f.gSId=z,f.gDtc=D,f.gSC=sb,f.sSC=C,f.gC=La,f.cRN=Mc,f.cRS=ed,f.gEL=ea,f.gEBTN=fa,f.cfgO=ud,f.pCfg=E,f.pCSAA=R,f.cFHFAU=yc,f.sCD=zc,f.bcv=W,f.ncv=oa,f.scv=Ga,f.stcv=Cb,f.rplC=Eb,f.cLSCK=ba,f.gFId=bd,f.gBAU=ad,f.iS=Zc,f.eWE=Wb,f.oEIE=Nb,f.oEIEWA=jb,f.eA=dc,f.dA=Rc,f.iNV=Uc,f.gVID=fc,f.dPV=od,f.ePV=Td,f.sVIdUP=gd,f.sVTT=Xa,f.sVID=nd,f.rVID=Gd,f.gVI=ae,f.gNVIdN=Sd,f.gARnVF=ub,f.cAUV=Pb,f.uVT=be,f.aNVL=w,f.gPC=Ed,f.cPC=Fd,f.sPC=Cc,f.clB=Ka,f.ct=ec,f.aRI=
                zb,f.iXB=wb,f.gXBR=Ja,f.sXBR=mb,f.de=L,f.cCL=fb,f.iEC=Of,f.rnw=Oa,f.gto=Ta,f.ael=O,f.rel=X,f.sup=T,f.cuel=pa,f.iAEPOO=Ob,f.iSM=K,f.aIOf=P,f.gxwp=ya,f.iIO=Va,f.prm=bb,f.cI=rd,f.gidi=Pa,f.iDCV=md,f.gCF=Za,f.gPSMB=Vb,f.lvl=nb,f)}function Re(){if(W("nsfnv")){var f=Za("dtCookie");if(-1===Sa(f,"".concat(og,"-"))){var n=Lb(f).serverId;f=f.replace("".concat(og).concat(n),"".concat(og).concat("".concat(-1*Mc(2,99)).replace("-","-2D")));C(f)}}}function zf(){Wb(function(){if(!D()){var f=-1*Mc(2,99),n=ed(Od);
                C("v_4".concat(og).concat("".concat(f).replace("-","-2D"),"_sn_").concat(n))}});w(Re)}this.dT_&&dT_.prm&&dT_.prm();var Af;(function(f){f[f.ENABLED=0]="ENABLED";f[f.DISABLED=1]="DISABLED";f[f.DELAYED=2]="DELAYED"})(Af||(Af={}));var Ig;(function(f){f[f.BLOCKED_BY_PERCENTAGE=0]="BLOCKED_BY_PERCENTAGE";f[f.ENABLED=1]="ENABLED";f[f.BLOCKED=2]="BLOCKED"})(Ig||(Ig={}));var ff;(function(f){f[f.NONE=1]="NONE";f[f.OFF=2]="OFF";f[f.PERFORMANCE=3]="PERFORMANCE";f[f.BEHAVIOR=4]="BEHAVIOR"})(ff||(ff={}));var Jg;
            (function(f){f.OVERLOAD_PREVENTION="ol";f.PRIVACY_STATE="prv";f.SERVER_ID="srv";f.SESSION_ID="sn"})(Jg||(Jg={}));var $g;(function(f){f.DYNATRACE_MOBILE="dynatraceMobile";f.MOBILE_AGENT="MobileAgent"})($g||($g={}));var Kg;(function(f){f[f.ARRAY=0]="ARRAY";f[f.BOOLEAN=1]="BOOLEAN";f[f.NUMBER=2]="NUMBER";f[f.STRING=3]="STRING";f[f.FUNCTION=4]="FUNCTION";f[f.OBJECT=5]="OBJECT";f[f.DATE=6]="DATE";f[f.ERROR=7]="ERROR";f[f.ELEMENT=8]="ELEMENT";f[f.HTML_ELEMENT=9]="HTML_ELEMENT";f[f.HTML_IMAGE_ELEMENT=10]=
                "HTML_IMAGE_ELEMENT";f[f.PERFORMANCE_ENTRY=11]="PERFORMANCE_ENTRY";f[f.PERFORMANCE_TIMING=12]="PERFORMANCE_TIMING";f[f.PERFORMANCE_RESOURCE_TIMING=13]="PERFORMANCE_RESOURCE_TIMING";f[f.PERFORMANCE_NAVIGATION_TIMING=14]="PERFORMANCE_NAVIGATION_TIMING";f[f.CSS_RULE=15]="CSS_RULE";f[f.CSS_STYLE_SHEET=16]="CSS_STYLE_SHEET";f[f.REQUEST=17]="REQUEST";f[f.RESPONSE=18]="RESPONSE";f[f.SET=19]="SET";f[f.MAP=20]="MAP";f[f.WORKER=21]="WORKER";f[f.XML_HTTP_REQUEST=22]="XML_HTTP_REQUEST";f[f.SVG_SCRIPT_ELEMENT=
                23]="SVG_SCRIPT_ELEMENT";f[f.HTML_META_ELEMENT=24]="HTML_META_ELEMENT";f[f.HTML_HEAD_ELEMENT=25]="HTML_HEAD_ELEMENT";f[f.ARRAY_BUFFER=26]="ARRAY_BUFFER";f[f.SHADOW_ROOT=27]="SHADOW_ROOT"})(Kg||(Kg={}));var Wa="undefined"!==typeof window?window:self,ag,Bd,ld=setTimeout;ta.prototype["catch"]=function(f){return this.then(null,f)};ta.prototype.then=function(f,n){var G=new this.constructor(Aa);Ia(this,new la(f,n,G));return G};ta.prototype["finally"]=function(f){var n=this.constructor;return this.then(function(G){return n.resolve(f()).then(function(){return G})},
                function(G){return n.resolve(f()).then(function(){return n.reject(G)})})};ta.all=function(f){return new ta(function(n,G){function F(Qb,hc){try{if(hc&&("object"===typeof hc||"function"===typeof hc)){var xc=hc.then;if("function"===typeof xc){xc.call(hc,function(cd){F(Qb,cd)},G);return}}Z[Qb]=hc;0===--Da&&n(Z)}catch(cd){G(cd)}}if(!f||"undefined"===typeof f.length)return G(new TypeError("Promise.all accepts an array"));var Z=Array.prototype.slice.call(f);if(0===Z.length)return n([]);for(var Da=Z.length,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Gb=0;Gb<Z.length;Gb++)F(Gb,Z[Gb])})};ta.allSettled=function(f){return new this(function(n,G){function F(Gb,Qb){if(Qb&&("object"===typeof Qb||"function"===typeof Qb)){var hc=Qb.then;if("function"===typeof hc){hc.call(Qb,function(xc){F(Gb,xc)},function(xc){Z[Gb]={status:"rejected",reason:xc};0===--Da&&n(Z)});return}}Z[Gb]={status:"fulfilled",value:Qb};0===--Da&&n(Z)}if(!f||"undefined"===typeof f.length)return G(new TypeError(typeof f+" "+f+" is not iterable(cannot read property Symbol(Symbol.iterator))"));
                var Z=Array.prototype.slice.call(f);if(0===Z.length)return n([]);var Da=Z.length;for(G=0;G<Z.length;G++)F(G,Z[G])})};ta.resolve=function(f){return f&&"object"===typeof f&&f.constructor===ta?f:new ta(function(n){n(f)})};ta.reject=function(f){return new ta(function(n,G){G(f)})};ta.race=function(f){return new ta(function(n,G){if(!f||"undefined"===typeof f.length)return G(new TypeError("Promise.race accepts an array"));for(var F=0,Z=f.length;F<Z;F++)ta.resolve(f[F]).then(n,G)})};ta.Fb="function"===typeof setImmediate&&
                function(f){setImmediate(f)}||function(f){ld(f,0)};ta.qc=function(f){"undefined"!==typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",f)};var v=ta,u={"!":"%21","~":"%7E","*":"%2A","(":"%28",")":"%29","'":"%27",$:"%24",";":"%3B",",":"%2C"},y;(function(f){f.ANCHOR="A";f.BUTTON="BUTTON";f.FORM="FORM";f.I_FRAME="IFRAME";f.IMAGE="IMG";f.INPUT="INPUT";f.LABEL="LABEL";f.LINK="LINK";f.OPTION="OPTION";f.SCRIPT="SCRIPT";f.SELECT="SELECT";f.STYLE="STYLE";f.TEXT_AREA="TEXTAREA"})(y||
                (y={}));var S,ka,Na,qb,lb=Wa.Worker,pb=lb&&lb.prototype.addEventListener,ob=[],Zb=["touchstart","touchend","scroll"],Ac,Qc="abort getAllResponseHeaders getResponseHeader open overrideMimeType send setRequestHeader".split(" "),Hc,kc,Xc,ce,Kd=(ce={},ce.l="Lax",ce.s="Strict",ce.n="None",ce),Db={},Od=32,pg;(function(f){f.LAX="l";f.NONE="n";f.NOT_SET="0";f.STRICT="s"})(pg||(pg={}));var Be="app-3A",wd=Wa.Worker,xf=Wa.Blob,sd=Wa.URL&&Wa.URL.createObjectURL,Cd,vd,Zd,Ce,De=!1,Oe,bg=[],Qd=[],Jd,de,he={},Kc,
                Ee=[],fd=[],$d=[],ie,qg,Fe,mg=6E8,Qe=!1,Zg=/([A-Z]+)-([0-9]+)/,ng=[],cg,Gg,Nf=!1,dg,Hg=!1,Lg,yf,je,og="".concat("_","srv").concat("_");(function(){var f,n;if(!(11>document.documentMode)){var G=0>(null===(f=navigator.userAgent)||void 0===f?void 0:f.indexOf("RuxitSynthetic"));if(!Wa.dT_||!Wa.dT_.cfg||"string"!==typeof Wa.dT_.cfg||"initialized"in Wa.dT_&&Wa.dT_.initialized)null===(n=Wa.console)||void 0===n?void 0:n.log("InitConfig not found or agent already initialized! This is an injection issue."),
            Wa.dT_&&(Wa.dT_.di=3);else if(G)try{Pf();var F;Xc=(F={},F.ade="",F.aew=!0,F.apn="",F.agentLocation="",F.agentUri="",F.app="",F.async=!1,F.ase=!1,F.auto=!1,F.bp=3,F.bisaoi=!1,F.bisCmE="",F.bs=!1,F.buildNumber=0,F.csprv=!0,F.cepl=16E3,F.cls=!0,F.ccNcss=!1,F.coo=!1,F.cooO=!1,F.cssm="0",F.cwt="",F.cwtUrl="27pd8x1igg",F.cors=!1,F.csu="",F.cuc="",F.cce=!1,F.cux=!1,F.dataDtConfig="",F.debugName="",F.dvl=500,F.dASXH=!1,F.disableCookieManager=!1,F.dKAH=!1,F.disableLogging=!1,F.dmo=!1,F.doel=!1,F.dpch=!1,F.dpvc=
                !1,F.disableXhrFailures=!1,F.domain="",F.domainOverride="",F.domainOriginal="",F.doNotDetect="",F.ds=!0,F.dsndb=!1,F.dsa=!1,F.dsss=!1,F.dssv=!0,F.earxa=!0,F.exp=!1,F.eni=!0,F.expw=!1,F.instr="",F.evl="",F.fa=!1,F.fvdi=!1,F.featureHash="",F.hvt=216E5,F.imm=!1,F.ign="",F.iub="",F.iqvn=!1,F.initializedModules="",F.lastModification=0,F.lupr=!0,F.lab=!1,F.legacy=!1,F.lt=!0,F.mb="",F.md="",F.mdp="",F.mdl="",F.mcepsl=100,F.mdn=5E3,F.mhl=4E3,F.mpl=1024,F.mmds=2E4,F.msl=3E4,F.bismepl=2E3,F.mel=200,F.mepp=
                10,F.moa=30,F.mrt=3,F.ntd=!1,F.nsfnv=!1,F.ncw=!1,F.oat=180,F.ote=!1,F.owasp=!1,F.pcl=20,F.pt=!0,F.perfbv=1,F.prfSmpl=0,F.pVO=!1,F.peti=!1,F.raxeh=!0,F.rdnt=0,F.nosr=!0,F.reportUrl="dynaTraceMonitor",F.rid="",F.ridPath="",F.rpid="",F.rcdec=12096E5,F.rtl=0,F.rtp=2,F.rtt=1E3,F.rtu=200,F.rvcl=24,F.sl=100,F.ssc=!1,F.svNB=!1,F.srad=!0,F.srbbv=1,F.srbw=!0,F.srdinitrec=!0,F.srmr=100,F.srms="1,1,,,",F.srsr=1E5,F.srtbv=3,F.srtd=1,F.srtr=500,F.srvr="",F.srvi=0,F.srwo=!1,F.srre="",F.srxcss=!0,F.srxicss=!0,F.srif=
                !1,F.srmrc=!1,F.srsdom=!0,F.srcss=!0,F.srmcrl=1,F.srmcrv=10,F.st=3E3,F.spc="",F.syntheticConfig=!1,F.tal=0,F.tt=100,F.tvc=3E3,F.uxdce=!1,F.uxdcw=1500,F.uxrgce=!0,F.uxrgcm="100,25,300,3;100,25,300,3",F.uam=!1,F.uana="data-dtname,data-dtName",F.uanpi=0,F.pui=!1,F.usrvd=!0,F.vrt=!1,F.vcfi=!0,F.vcsb=!1,F.vcit=1E3,F.vct=50,F.vcx=50,F.vscl=0,F.vncm=1,F.xb="",F.chw="",F.xt=0,F.xhb="",F);var Z;bb();var Da;Ac=Wa.XMLHttpRequest;var Gb=null===(Da=Wa.XMLHttpRequest)||void 0===Da?void 0:Da.prototype;if(Gb)for(Hc=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          {},f=0,n=Qc;f<n.length;f++){var Qb=n[f];void 0!==Gb[Qb]&&(Hc[Qb]=Gb[Qb])}S=Wa.addEventListener;ka=Wa.removeEventListener;Na=Wa.document.addEventListener;qb=Wa.document.removeEventListener;Zd=Wa.setTimeout;Ce=Wa.setInterval;De||(Cd=Wa.clearTimeout,vd=Wa.clearInterval);var hc=hb?hb():navigator.cookieEnabled,xc=1===Lb(Za("dtAdkSettings")||(null===(Z=de)||void 0===Z?void 0:Z.getItem("dtAdkSettings"))||"").overloadState;fb();if(!(!hc||xc?0:"complete"!==document.readyState||Wa.performance&&Wa.performance.timing))throw Error("Error during initCode initialization");
                try{de=Wa.localStorage}catch(Mh){}Qd=[];sa();Jd=Kc();Oe=[];he={};De||(Wa.clearTimeout=Ca(Cd),Wa.clearInterval=Ca(vd),De=!0);var cd=Math.random(),eg=Math.random();qg=0!==cd&&0!==eg&&cd!==eg;if(-1!==Sa(navigator.userAgent,"Googlebot")){var Ld=performance.getEntriesByType("navigation")[0];Z=1;if(Ld){for(var ke in Ld){var se=Ld[ke];"number"===typeof se&&se&&(Z=1===Z?se:Z+se)}var xd=Math.floor(1E4*Z)}else xd=Z;ie=Dd(xd)}else qg?ie=Math.random:ie=Dd(Kc());Fe=Jd%mg+"_"+ab(Mc(0,1E3)+"");a:{var Bf=Wa.dT_.cfg;
                    Db={reportUrl:"dynaTraceMonitor",initializedModules:"",csu:"dtagent",dataDtConfig:"string"===typeof Bf?Bf:""};Wa.dT_.cfg=Db;Db.csu="ruxitagentjs";var Pd=Db.dataDtConfig;Pd&&-1===Sa(Pd,"#CONFIGSTRING")&&(R(Pd,Db),qc("domain"),qc("auto"),qc("app"),yc(Db));var ee=fa("script"),Qf=ee.length,gf=-1===Sa(Db.dataDtConfig||"","#CONFIGSTRING")?Db:null;if(0<Qf)for(xd=0;xd<Qf;xd++)b:{Ld=void 0;var le=ee[xd];ke=gf;if(le.attributes){var Cf=Db.csu+"_bootstrap.js";se=/.*\\/jstag\\/.*\\/.*\\/(.*)_bs(_dbg)?.js$/;Bf=ke;
                        var Ud=le.src,rg=null===Ud||void 0===Ud?void 0:Ud.indexOf(Cf),Se=le.attributes.getNamedItem("data-dtconfig");if(Se){Pd=void 0;Z=Ud;var Ge=Se.value;Gb={};Db.legacy="1";Qb=/([a-zA-Z]*)_([a-zA-Z_0-9]*)_([0-9]+)/g;Z&&(Pd=Qb.exec(Z),null===Pd||void 0===Pd?0:Pd.length)&&(Gb.csu=Pd[1],Gb.featureHash=Pd[2],Gb.agentLocation=Z.substring(0,Sa(Z,Pd[1])-1),Gb.buildNumber=Pd[3]);if(Ge){R(Ge,Gb,!0);var ah=Gb.agentUri;!Z&&ah&&(Pd=Qb.exec(ah),null===Pd||void 0===Pd?0:Pd.length)&&(Gb.csu=Pd[1])}tc(Gb);Ld=Gb;if(!ke)Bf=
                            Ld;else if(!Ld.syntheticConfig){gf=Ld;break b}}Ld||(Ld=Db);if(0<rg){var bh=rg+Cf.length+5;Ld.app=Ud.length>bh?Ud.substring(bh):"Default%20Application"}else if(Ud){var sg=se.exec(Ud);sg&&(Ld.app=sg[1])}gf=Bf}else gf=ke}if(gf)for(var Rf in gf)Object.prototype.hasOwnProperty.call(gf,Rf)&&(ee=Rf,Db[ee]=gf[ee]);var Sf=ba();try{var fe=(gf=de)&&gf.getItem(Sf);if(fe){var Tf=E(fe),Te=R(Tf.config||""),qh=Db.lastModification||"0",Nh=ab((Te.lastModification||Tf.lastModification||"0").substring(0,13)),Ni="string"===
                    typeof qh?ab(qh.substring(0,13)):qh;if(!qh||Nh>=Ni)if(Te.csu=Tf.name||Ga("csu"),Te.featureHash=Tf.featureHash||Ga("featureHash"),Te.agentUri&&yc(Te),zc(Te,!0),wb(Te),zb(Te),Nh>(+Db.lastModification||0)){var rh=W("auto"),hd=W("legacy");Db=Eb(Te);Db.auto=rh?"1":"0";Db.legacy=hd?"1":"0"}}}catch(Mh){}zc(Db);try{var tg=Db.ign;if(tg&&(new RegExp(tg)).test(Wa.location.href)){document.dT_=Wa.dT_=void 0;var He=!1;break a}}catch(Mh){}if(K()){var Df=navigator.userAgent,Ue=Df.lastIndexOf("RuxitSynthetic");if(-1===
                        Ue)var fg={};else{var Ve=Df.substring(Ue+14);if(-1===Sa(Ve," c"))fg={};else{Sf={};fe=0;for(var te=Ve.split(" ");fe<te.length;fe++){var ch=te[fe];if("c"===ch.charAt(0)){var gg=ch.substring(1),Ie=gg.indexOf("="),ug=gg.substring(0,Ie),Mg=gg.substring(Ie+1);ug&&Mg&&(Sf[ug]=Mg)}}fg=Sf}}Ve=void 0;for(Ve in fg)Object.prototype.hasOwnProperty.call(fg,Ve)&&fg[Ve]&&(Db[Ve]=fg[Ve]);Eb(Db)}He=!0}if(!He)throw Error("Error during config initialization");Pe();Lg=Wa.dT_.disabled;var hf;if(!(hf=Ga("agentLocation")))a:{var Oh=
                    Ga("agentUri");if(Oh||document.currentScript){var jf=Oh||document.currentScript.src;if(jf){He=jf;var Ph=-1===Sa(He,"_bs")&&-1===Sa(He,"_bootstrap")&&-1===Sa(He,"_complete")?1:2,Ng=jf.lastIndexOf("/");for(He=0;He<Ph&&-1!==Ng;He++)jf=jf.substring(0,Ng),Ng=jf.lastIndexOf("/");hf=jf;break a}}var dh=location.pathname;hf=dh.substring(0,dh.lastIndexOf("/"))}yf=hf;je=Ga("csu")||"ruxitagentjs";"true"===Za("dtUseDebugAgent")&&0>je.indexOf("dbg")&&(je=Ga("debugName")||je+"dbg");if(!W("auto")&&!W("legacy")&&
                    !Lg){var Ef=Ga("agentUri")||ad(Ga("featureHash"));if(W("async")||"complete"===document.readyState)Zc(Ef,W("async"),void 0,void 0,"dtjsagent");else{var Oi="".concat("dtjsagent","dw");document.write('<script id="'.concat(Oi,'" type="text/javascript" src="').concat(Ef,'">\x3c/script>'));document.getElementById(Oi)||Zc(Ef,W("async"),void 0,void 0,"dtjsagent")}}Za("dtCookie")&&Cb("cooO",!0);zf();Cb("pVO",!!nb("dt-pVO"));Wb(fc);cg=18E5;Gg=oa("hvt")||216E5;jb(Fd,[1])}catch(Mh){delete Wa.dT_,fb()&&Wa.console.log("JsAgent initCode initialization failed!",
                Mh)}}})()})();`
  }
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.setHeader('content-type', 'application/javascript')
  res.send(`window.projectOverrides = {
        ${output}
    };
    
    ${dynatrace}
    `)
})

// Optionally proxy the API to get around CSRF issues, exposing the API to the world
// FLAGSMITH_PROXY_API_URL should end with the hostname and not /api/v1/
// e.g. FLAGSMITH_PROXY_API_URL=http://api.flagsmith.com/
if (process.env.FLAGSMITH_PROXY_API_URL) {
  const { createProxyMiddleware } = require('http-proxy-middleware')
  app.use(
    '/api/v1/',
    createProxyMiddleware({
      changeOrigin: true,
      target: process.env.FLAGSMITH_PROXY_API_URL,
      xfwd: true,
    }),
  )
}

if (isDev) {
  // Serve files from src directory and use webpack-dev-server
  // eslint-disable-next-line
  console.log('Enabled Webpack Hot Reloading')
  const webpackMiddleware = require('./middleware/webpack-middleware')
  webpackMiddleware(app)
  app.set('views', 'web/')
  app.use(express.static('web'))
} else {
  if (!process.env.VERCEL) {
    app.use(express.static('public'))
  }
  if (fs.existsSync(path.join(process.cwd(), 'frontend'))) {
    app.set('views', 'frontend/public/static')
  } else {
    app.set('views', 'public/static')
  }
}

app.engine(
  'handlebars',
  exphbs.create({
    defaultLayout: '',
    layoutsDir: '',
  }).engine,
)
app.set('view engine', 'handlebars')

app.get('/robots.txt', (req, res) => {
  res.send('User-agent: *\r\nDisallow: /')
})

app.get('/health', (req, res) => {
  // eslint-disable-next-line
  console.log('Healthcheck complete')
  res.send('OK')
})

app.get('/version', (req, res) => {
  let commitSha = 'Unknown'
  let imageTag = 'Unknown'

  try {
    commitSha = fs
      .readFileSync('CI_COMMIT_SHA', 'utf8')
      .replace(/(\r\n|\n|\r)/gm, '')
  } catch (err) {
    // eslint-disable-next-line
    console.log('Unable to read CI_COMMIT_SHA')
  }

  try {
    releasePleaseManifest = JSON.parse(
      fs.readFileSync('./.versions.json', 'utf8'),
    )
    res.send({
      'ci_commit_sha': commitSha,
      'image_tag': releasePleaseManifest['.'],
      'package_versions': releasePleaseManifest,
    })
  } catch (err) {
    // eslint-disable-next-line
    console.log('Unable to read .versions.json file')
    res.send({ 'ci_commit_sha': commitSha, 'image_tag': imageTag })
  }
})

app.use(bodyParser.json())
app.use(spm)
const genericWebsite = (url) => {
  if (!url) return true
  if (
    url.includes('hotmail.') ||
    url.includes('gmail.') ||
    url.includes('icloud.') ||
    url.includes('flagsmith.com')
  ) {
    return true
  }
  return false
}
app.post('/api/event', (req, res) => {
  try {
    const body = req.body
    const channel = body.tag
      ? `infra_${body.tag.replace(/ /g, '').toLowerCase()}`
      : process.env.EVENTS_SLACK_CHANNEL
    if (
      process.env.SLACK_TOKEN &&
      channel &&
      postToSlack &&
      !body.event.includes('Bullet Train')
    ) {
      const match = body.event.match(
        /([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})/,
      )
      let url = ''
      if (match && match[0]) {
        const urlMatch = match[0].split('@')[1]
        if (!genericWebsite(urlMatch)) {
          url = ` https://www.similarweb.com/website/${urlMatch}`
        }
      }
      slackClient(body.event + url, channel).finally(() => {
        res.json({})
      })
    } else {
      res.json({})
    }
  } catch (e) {
    // eslint-disable-next-line
    console.log(`Error posting to from /api/event:${e}`)
  }
})

app.post('/api/webflow/webhook', (req, res) => {
  if (req.body.name === 'Contact Form') {
    // Post to Pipedrive
    if (postToSlack) {
      console.log('Contact Us Form - Creating Pipedrive Lead')

      const newPerson = pipedrive.NewPerson.constructFromObject({
        email: [
          {
            primary: 'true',
            value: req.body.data.email,
          },
        ],
        name: req.body.data.name,
        phone: [
          {
            label: 'work',
            primary: 'true',
            value: req.body.data.phone,
          },
        ],
      })

      console.log('Contact Us Form - Person Created')

      pipedrivePersonsApi.addPerson(newPerson).then(
        (personData) => {
          console.log(
            `pipedrivePersonsApi called successfully. Returned data: ${personData}`,
          )

          const newLead = pipedrive.AddLeadRequest.constructFromObject({
            f001193d9249bb49d631d7c2c516ab72f9ebd204: 'Website Contact Us Form',
            person_id: personData.data.id,
            title: `${personData.data.primary_email}`,
          })

          console.log('Adding Lead.')
          pipedriveLeadsApi.addLead(newLead).then(
            (leadData) => {
              console.log(
                `pipedriveLeadsApi called successfully. Returned data: ${leadData}`,
              )

              const newNote = pipedrive.AddNoteRequest.constructFromObject({
                content: `From Website Contact Us Form: ${
                  req.body.data.message != null
                    ? req.body.data.message
                    : 'No note supplied'
                }`,
                lead_id: leadData.data.id,
              })

              console.log('Adding Note.')
              pipedriveNotesApi.addNote(newNote).then(
                async (noteData) => {
                  console.log(
                    `pipedriveNotesApi called successfully. Returned data: ${noteData}`,
                  )
                  //todo: Tidy up above with async calls and call destinations in parallel
                  if (process.env.DATA_RELAY_API_KEY && postToSlack) {
                    try {
                      await dataRelay.sendEvent(req.body.data, {
                        apiKey: process.env.DATA_RELAY_API_KEY,
                      })
                    } catch (e) {
                      console.log(
                        'Error sending Contact us form sent to Relay:\r\n',
                        e,
                        formMessage,
                      )
                    }
                  }
                  return res.status(200).json({})
                },
                (error) => {
                  console.log('pipedriveNotesApi called error')
                  return res.status(200).json({
                    body: error,
                  })
                },
              )
            },
            (error) => {
              console.log('pipedriveLeadsApi called error')
              return res.status(200).json({
                body: error,
              })
            },
          )
        },
        (error) => {
          console.log('pipedrivePersonsApi called error. Returned data:')
          return res.status(200).json({
            body: error,
          })
        },
      )
    } else {
      return res.status(200).json({})
    }
  } else if (req.body.name === 'Subscribe Form') {
    console.log('Todo: process Subscribe form')
    return res.status(200).json({})
  } else {
    return res.status(200).json({})
  }
})

// Catch all to render index template
app.get('/', (req, res) => {
  const linkedin = process.env.LINKEDIN || ''
  return res.render('index', {
    isDev,
    linkedin,
  })
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server listening on: ${port}`)
  if (!isDev && process.send) {
    process.send({ done: true })
  }
})

module.exports = app
