import * as amplitude from '@amplitude/analytics-browser'
import data from 'common/data/base/_data'
const enableDynatrace = !!window.enableDynatrace && typeof dtrum !== 'undefined'
import freeEmailDomains from 'free-email-domains'
global.API = {
  ajaxHandler(store, res) {
    switch (res.status) {
      case 404:
        // ErrorModal(null, 'API Not found: ');
        break
      case 503:
        // ErrorModal(null, error);
        break
      default:
      // ErrorModal(null, error);
    }

    // Catch coding errors that end up here
    if (typeof res === 'string') {
      store.error = new Error(res)
      store.goneABitWest()
      return
    }
    if (res instanceof Error) {
      console.error(res)
      store.error = res
      store.goneABitWest()
      return
    } else if (res.data) {
      store.error = res.data
      store.goneABitWest()
      return
    } else if (typeof res.text !== 'function') {
      store.error = res
      store.goneABitWest()
      return
    }

    res
      .text()
      .then((error) => {
        if (store) {
          let err = error
          try {
            err = JSON.parse(error)
          } catch (e) {}
          store.error = err
          store.goneABitWest()
        }
      })
      .catch(() => {
        if (store) {
          store.goneABitWest()
        }
      })
  },
  alias(id, user = {}) {
    if (Project.excludeAnalytics?.includes(id)) return
    if (Project.mixpanel) {
      mixpanel.alias(id)
    }

    if (enableDynatrace && user?.id) {
      dtrum.identifyUser(`${user.id}`)
    }

    if (Project.heap) {
      heap.identify(id)
      const user = AccountStore.model
      const orgs =
        (user &&
          user.organisations &&
          _.map(
            user.organisations,
            (o) => `${o.name} #${o.id}(${o.role})[${o.num_seats}]`,
          ).join(',')) ||
        ''
      const plans = AccountStore.getPlans()
      heap.addUserProperties({
        // use human-readable names
        '$first_name': user.first_name,

        '$last_name': user.last_name,
        'USER_ID': id,
        email: id,
        'isCompanyEmail':
          !user.email.includes('@gmail') &&
          !user.email.includes('@yahoo') &&
          !user.email.includes('@hotmail') &&
          !user.email.includes('@icloud'),
        orgs,
        'plan': plans && plans.join(','),
      })
    }
    if (Project.amplitude) {
      amplitude.setUserId(id)
      const identify = new amplitude.Identify().set('email', id)
      amplitude.identify(identify)
    }
    API.flagsmithIdentify()
  },
  flagsmithIdentify() {
    const user = AccountStore.model
    if (!user) {
      return
    }

    flagsmith
      .identify(user.id, {
        email: user.email,
        organisations: user.organisations
          ? user.organisations.map((o) => `"${o.id}"`).join(',')
          : '',
      })
      .then(() => {
        return flagsmith.setTrait(
          'logins',
          (flagsmith.getTrait('logins') || 0) + 1,
        )
      })
      .then(() => {
        const organisation = AccountStore.getOrganisation()
        const emailDomain = `${user?.email}`?.split('@')[1] || ''
        const freeDomain = freeEmailDomains.includes(emailDomain)
        if (
          !freeDomain &&
          typeof delighted !== 'undefined' &&
          flagsmith.hasFeature('delighted')
        ) {
          delighted.survey({
            createdAt: user.date_joined || new Date().toISOString(),
            email: user.email,
            name: `${user.first_name || ''} ${user.last_name || ''}`, // time subscribed (optional)
            properties: {
              company: organisation?.name,
            },
          })
        }
      })
  },
  getCookie(key) {
    const res = require('js-cookie').get(key)
    if (res) {
      //reset expiry
      API.setCookie(key, res)
    }
    return res
  },
  getEvent() {
    return API.getCookie('event')
  },
  getInvite() {
    return require('js-cookie').get('invite')
  },
  getInviteType() {
    return require('js-cookie').get('invite-type') || 'NO_INVITE'
  },
  getRedirect() {
    return API.getCookie('redirect')
  },
  getReferrer() {
    const r = require('js-cookie').get('r')
    try {
      return JSON.parse(r)
    } catch (e) {
      return null
    }
  },
  identify(id, user = {}) {
    if (Project.excludeAnalytics?.includes(id)) return
    try {
      const orgs =
        (user &&
          user.organisations &&
          _.map(
            user.organisations,
            (o) => `${o.name} #${o.id}(${o.role})[${o.num_seats}]`,
          ).join(',')) ||
        ''
      if (Project.mixpanel) {
        mixpanel.identify(id)
        const plans = AccountStore.getPlans()

        mixpanel.people.set({
          '$email': id,
          // use human-readable names
          '$first_name': user.first_name,

          '$last_name': user.last_name,
          // only reserved properties need the $
          'USER_ID': id,
          'isCompanyEmail':
            !user.email.includes('@gmail') &&
            !user.email.includes('@yahoo') &&
            !user.email.includes('@hotmail') &&
            !user.email.includes('@icloud'),
          orgs,
          'plan': plans && plans.join(','),
        })
      }

      if (enableDynatrace && user?.id) {
        dtrum.identifyUser(`${user.id}`)
      }

      if (Project.heap) {
        const plans = AccountStore.getPlans()
        heap.identify(id)
        heap.addUserProperties({
          // use human-readable names
          '$first_name': user.first_name,
          '$last_name': user.last_name,
          'USER_ID': id,
          email: id,
          'isCompanyEmail':
            !user.email.includes('@gmail') &&
            !user.email.includes('@yahoo') &&
            !user.email.includes('@hotmail') &&
            !user.email.includes('@icloud'),
          orgs,
          'plan': plans && plans.join(','),
        })
      }

      if (Project.amplitude) {
        amplitude.setUserId(id)
        const identify = new amplitude.Identify()
          .set('email', id)
          .set('name', { 'first': user.first_name, 'last': user.last_name })

        amplitude.identify(identify)
      }
      API.flagsmithIdentify()
    } catch (e) {
      console.error('Error identifying', e)
    }
  },
  log() {
    console.log.apply(this, arguments)
  },
  postEvent(event, tag) {
    if (!AccountStore.getUser()) return
    const organisation = AccountStore.getOrganisation()
    const name =
      organisation && organisation.name ? ` - ${organisation.name}` : ''
    return data.post('/api/event', {
      event: `${event}(${AccountStore.getUser().email} ${
        AccountStore.getUser().first_name
      } ${AccountStore.getUser().last_name})${name}`,
      tag,
    })
  },
  register(email, firstName, lastName) {
    if (Project.excludeAnalytics?.includes(email)) return
    if (Project.mixpanel) {
      mixpanel.register({
        'Email': email,
        'First Name': firstName,
        'Last Name': lastName,
      })
    }
  },
  reset() {
    if (Project.mixpanel) {
      mixpanel.reset()
    }
    return flagsmith.logout()
  },
  setCookie(key, v) {
    try {
      if (!v) {
        require('js-cookie').remove(key, {
          domain: Project.cookieDomain,
          path: '/',
        })
        require('js-cookie').remove(key, { path: '/' })
      } else {
        if (E2E) {
          // Since E2E is not https, we can't set secure cookies
          require('js-cookie').set(key, v, { expires: 30, path: '/' })
        } else {
          // We need samesite secure cookies to allow for IFrame embeds from 3rd parties
          require('js-cookie').set(key, v, {
            expires: 30,
            path: '/',
            sameSite: Project.cookieSameSite || 'Lax',
            secure: Project.useSecureCookies,
          })
        }
      }
    } catch (e) {}
  },
  setEvent(v) {
    return API.setCookie('event', v)
  },
  setInvite(id) {
    const cookie = require('js-cookie')
    cookie.set('invite', id)
  },
  setInviteType(id) {
    const cookie = require('js-cookie')
    cookie.set('invite-type', id)
  },
  setRedirect(v) {
    return API.setCookie('redirect', v)
  },
  trackEvent(data) {
    if (Project.ga) {
      if (Project.logAnalytics) {
        console.log('ANALYTICS EVENT', data)
      }
      if (!data) {
        console.error('Passed null event data')
      }
      console.info('track', data)
      if (!data || !data.category || !data.event) {
        console.error('Invalid event provided', data)
      }
      if (data.category === 'First') {
        API.postEvent(
          data.event + (data.extra ? ` ${data.extra}` : ''),
          'first_events',
        )
      }
      ga('send', {
        eventAction: data.event,
        eventCategory: data.category,
        eventLabel: data.label,
        hitType: 'event',
      })
    }

    if (Project.heap) {
      heap.track(data.event, {
        category: data.category,
      })
    }
    if (Project.amplitude) {
      const eventData = {
        category: data.category,
        ...(data.extra || {}),
      }

      amplitude.track(data.event, eventData)
    }
    if (Project.mixpanel) {
      if (!data) {
        console.error('Passed null event data')
      }
      console.info('track', data)
      if (!data || !data.category || !data.event) {
        console.error('Invalid event provided', data)
      }
      mixpanel.track(data.event, {
        category: data.category,
      })
    }
  },
  trackPage(title) {
    if (Project.ga) {
      ga('send', {
        hitType: 'pageview',
        location: document.location.href,
        page: document.location.pathname,
        title,
      })
    }
    if (Project.heap) {
      heap.track(`Page View  - ${title}`, {
        location: document.location.href,
        page: document.location.pathname,
        title,
      })
    }
    if (Project.mixpanel) {
      mixpanel.track(`Page View  - ${title}`, {
        location: document.location.href,
        page: document.location.pathname,
        title,
      })
    }
  },
}

export default API
