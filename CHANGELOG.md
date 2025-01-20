# Changelog

## [2.160.0](https://github.com/Flagsmith/flagsmith/compare/v2.159.0...v2.160.0) (2025-01-20)


### Features

* Adds Licensing upload tab ([#4934](https://github.com/Flagsmith/flagsmith/issues/4934)) ([5e1c1be](https://github.com/Flagsmith/flagsmith/commit/5e1c1be60304385f578dc538c31ad0877cf3ff1c))
* Improves segment rule value validation and feedback ([#4975](https://github.com/Flagsmith/flagsmith/issues/4975)) ([8db1a3d](https://github.com/Flagsmith/flagsmith/commit/8db1a3d98908c65267cf44081a4e9df5a8a0c2e1))


### Bug Fixes

* `POST /identities` incorrectly applies segment overrides when using null or empty identifier, only in Core API ([#5018](https://github.com/Flagsmith/flagsmith/issues/5018)) ([3557e14](https://github.com/Flagsmith/flagsmith/commit/3557e1480ae8cbc7f4e60492fba87b4328a39fd1))
* Action dropdown not properly overflowing ([#5000](https://github.com/Flagsmith/flagsmith/issues/5000)) ([5fc9fef](https://github.com/Flagsmith/flagsmith/commit/5fc9fefbcb84f1227b80cd890c974a0669af1774))
* Adds force-2fa to startup plan ([#4994](https://github.com/Flagsmith/flagsmith/issues/4994)) ([d0e2f76](https://github.com/Flagsmith/flagsmith/commit/d0e2f760cd47f70512f7ba73e15167aef411dcc4))
* Don't display password managers on irrelevant input fields ([#5004](https://github.com/Flagsmith/flagsmith/issues/5004)) ([c04eb95](https://github.com/Flagsmith/flagsmith/commit/c04eb95101c8baf366e3a39cad6404e9fbacc3a0))
* Remove AWS IMDS endpoint request on API startup ([#5008](https://github.com/Flagsmith/flagsmith/issues/5008)) ([2e79ff4](https://github.com/Flagsmith/flagsmith/commit/2e79ff4b5f26a5537758011e2cbda8af2cfc4d97))
* role permissions ([#4996](https://github.com/Flagsmith/flagsmith/issues/4996)) ([4a90cf6](https://github.com/Flagsmith/flagsmith/commit/4a90cf6b576962e6d6b66326e86aa5f1a3c3cb91))
* Set logger for skipping API usage ([#5003](https://github.com/Flagsmith/flagsmith/issues/5003)) ([3c49ae0](https://github.com/Flagsmith/flagsmith/commit/3c49ae06c3fcb151d920cb3222cd3a4de6b5cdc7))
* Use "Flagsmith" as default TOTP issuer ([#4992](https://github.com/Flagsmith/flagsmith/issues/4992)) ([0681988](https://github.com/Flagsmith/flagsmith/commit/0681988d33a38c885a63eb1eaca1bd4ddcff567f))


### Dependency Updates

* bump django from 4.2.17 to 4.2.18 in /api ([#5012](https://github.com/Flagsmith/flagsmith/issues/5012)) ([3ac455d](https://github.com/Flagsmith/flagsmith/commit/3ac455d5cab524a09083b8126379f6cc868b535d))
* bump katex from 0.16.11 to 0.16.21 in /docs ([#5015](https://github.com/Flagsmith/flagsmith/issues/5015)) ([fc437d5](https://github.com/Flagsmith/flagsmith/commit/fc437d5905db87d12fd500e63d01f84309adac57))
* bump task-processor ([#4995](https://github.com/Flagsmith/flagsmith/issues/4995)) ([a122146](https://github.com/Flagsmith/flagsmith/commit/a1221468f9debd103e8d9039b32d2dd0acafdc05))

## [2.159.0](https://github.com/Flagsmith/flagsmith/compare/v2.158.0...v2.159.0) (2025-01-13)


### Features

* Adds plus indicator when `is_num_identity_overrides_complete` is false ([#4938](https://github.com/Flagsmith/flagsmith/issues/4938)) ([df074cb](https://github.com/Flagsmith/flagsmith/commit/df074cb9028cd90bdba8112238259772c86f8ca1))


### Bug Fixes

* **export:** fixes issue exporting identity feature states with missing attributes ([#4987](https://github.com/Flagsmith/flagsmith/issues/4987)) ([8cd2731](https://github.com/Flagsmith/flagsmith/commit/8cd27318bd9de08cd45785868e7d77541c9e3a61))
* handle fetch github stars errors ([#4952](https://github.com/Flagsmith/flagsmith/issues/4952)) ([580dcae](https://github.com/Flagsmith/flagsmith/commit/580dcaea4e7aaa45a439f5d95d31fd4ea752140d))
* Speed up identity overrides ([#4840](https://github.com/Flagsmith/flagsmith/issues/4840)) ([60d042d](https://github.com/Flagsmith/flagsmith/commit/60d042da8a4ce11f4a3adb893df7dc71f6c75524))
* **tests:** Incorrect mock in `test_ensure_identity_traits_blanks__exclusive_start_key__calls_expected` ([#4944](https://github.com/Flagsmith/flagsmith/issues/4944)) ([bbe7db1](https://github.com/Flagsmith/flagsmith/commit/bbe7db188657ec542e8a2dd15648c3de3b6dbd6e))
* Update boto3 and dependencies to latest versions - autoinstrumentation Datadog ([#4986](https://github.com/Flagsmith/flagsmith/issues/4986)) ([645b408](https://github.com/Flagsmith/flagsmith/commit/645b40842aba30f516402018942a6c42d597df9b))
* Updates user segment tab when a segment is created/updated ([#4950](https://github.com/Flagsmith/flagsmith/issues/4950)) ([6c9ad03](https://github.com/Flagsmith/flagsmith/commit/6c9ad03001576b1fab48f5ebb06992e52cd51233))


### Dependency Updates

* add licensing to private installation ([#4947](https://github.com/Flagsmith/flagsmith/issues/4947)) ([fe949c8](https://github.com/Flagsmith/flagsmith/commit/fe949c82dc8d9a71db9b37c1b3e3e9943368802e))
* bump task processor v1.1.1 and workflows v2.7.5 ([#4942](https://github.com/Flagsmith/flagsmith/issues/4942)) ([95ebbdf](https://github.com/Flagsmith/flagsmith/commit/95ebbdf05e716a47fa9a3ef1017c862ea76c4c8d))

## [2.158.0](https://github.com/Flagsmith/flagsmith/compare/v2.157.1...v2.158.0) (2025-01-02)


### Features

* Displays what entity is being edited in side modal ([#4927](https://github.com/Flagsmith/flagsmith/issues/4927)) ([c1e0aea](https://github.com/Flagsmith/flagsmith/commit/c1e0aeaf5d0141f10ebb4b9dbefff0cc9cc99305))
* Support `--exclusive-start-key` option for `ensure_identity_traits_blanks` ([#4941](https://github.com/Flagsmith/flagsmith/issues/4941)) ([4f71482](https://github.com/Flagsmith/flagsmith/commit/4f71482f06221dee2f22fdf75156991623bfead8))


### Bug Fixes

* Add explicit pagination to change requests ([#4925](https://github.com/Flagsmith/flagsmith/issues/4925)) ([cafb663](https://github.com/Flagsmith/flagsmith/commit/cafb663f423d1a34efeeac6442c2c26ae2ab2e65))

## [2.157.1](https://github.com/Flagsmith/flagsmith/compare/v2.157.0...v2.157.1) (2024-12-16)


### Bug Fixes

* description state management in EnvironmentSettingsPage ([#4917](https://github.com/Flagsmith/flagsmith/issues/4917)) ([0223227](https://github.com/Flagsmith/flagsmith/commit/02232278a1309a1b04bbe5ea03ed8019b0eec849))
* Numbers such as 1e100 cannot be retrieved from DynamoDB ([#4916](https://github.com/Flagsmith/flagsmith/issues/4916)) ([5d02ab1](https://github.com/Flagsmith/flagsmith/commit/5d02ab17cda6854d17933d0eff5a835ad2ea99ea))
* Preserve Page number in URL at AuditLogs page ([#4913](https://github.com/Flagsmith/flagsmith/issues/4913)) ([6cd6cb8](https://github.com/Flagsmith/flagsmith/commit/6cd6cb866af2ec17357b13a51e9fad56af743446))
* Set project change requests url ([#4920](https://github.com/Flagsmith/flagsmith/issues/4920)) ([e94e5c6](https://github.com/Flagsmith/flagsmith/commit/e94e5c6064c4b0df1a4cd09ddb9a0b8d30c75612))

## [2.157.0](https://github.com/Flagsmith/flagsmith/compare/v2.156.2...v2.157.0) (2024-12-10)


### Features

* Heal all identities with blank traits ([#4908](https://github.com/Flagsmith/flagsmith/issues/4908)) ([5405cc5](https://github.com/Flagsmith/flagsmith/commit/5405cc59b4e49a8936a278439c018072fcdc7df4))


### Bug Fixes

* **chargebee:** ensure that missing api calls are handled correctly ([#4901](https://github.com/Flagsmith/flagsmith/issues/4901)) ([38b4300](https://github.com/Flagsmith/flagsmith/commit/38b43004d139278a1cadc4935c5b36ab9c1cf360))
* Relax Hubspot cookie tracking ([#4905](https://github.com/Flagsmith/flagsmith/issues/4905)) ([4f20e5a](https://github.com/Flagsmith/flagsmith/commit/4f20e5a551a6d2f70329d4851188f5ebedd55f4b))
* Restore `make docker-up` ([#4907](https://github.com/Flagsmith/flagsmith/issues/4907)) ([f97c56f](https://github.com/Flagsmith/flagsmith/commit/f97c56fd79703212354d8dbbb6a7e6ca438e78a3))

## [2.156.2](https://github.com/Flagsmith/flagsmith/compare/v2.156.1...v2.156.2) (2024-12-10)


### Bug Fixes

* anchor button height ([#4891](https://github.com/Flagsmith/flagsmith/issues/4891)) ([7048c4c](https://github.com/Flagsmith/flagsmith/commit/7048c4c213ed60077aa85c30812d03544b10327a))
* audit log integrations for versioned environments ([#4876](https://github.com/Flagsmith/flagsmith/issues/4876)) ([486bcd1](https://github.com/Flagsmith/flagsmith/commit/486bcd1d2fc6a360f002183027186d70798b4f06))
* **pre-commit:** refactor prettier hook ([#4902](https://github.com/Flagsmith/flagsmith/issues/4902)) ([cbecde7](https://github.com/Flagsmith/flagsmith/commit/cbecde7cb53fd0865807f947de04f99407eacdaf))

## [2.156.1](https://github.com/Flagsmith/flagsmith/compare/v2.156.0...v2.156.1) (2024-12-04)


### Bug Fixes

* save versioned segment overrides ([#4892](https://github.com/Flagsmith/flagsmith/issues/4892)) ([f5e3410](https://github.com/Flagsmith/flagsmith/commit/f5e3410dec3ed09ffe99a913836ce2ebd1044a6d))

## [2.156.0](https://github.com/Flagsmith/flagsmith/compare/v2.155.0...v2.156.0) (2024-12-04)


### Features

* combine value + segment change requests for versioned environments ([#4738](https://github.com/Flagsmith/flagsmith/issues/4738)) ([e6b0e2f](https://github.com/Flagsmith/flagsmith/commit/e6b0e2f799d0c6bc513e622ca19b9698f6f76db2))
* Enterprise licensing ([#3624](https://github.com/Flagsmith/flagsmith/issues/3624)) ([fbd1a13](https://github.com/Flagsmith/flagsmith/commit/fbd1a13497ef805e3b23e1877e7ccfe087cf197b))
* Scheduled segment overrides ([#4805](https://github.com/Flagsmith/flagsmith/issues/4805)) ([bb7849c](https://github.com/Flagsmith/flagsmith/commit/bb7849c799fff98c1750adf1d5a057479994d41b))
* tag based permissions ([#4853](https://github.com/Flagsmith/flagsmith/issues/4853)) ([7c4e2ff](https://github.com/Flagsmith/flagsmith/commit/7c4e2ff23ea66bf8e3dfb57b3492454a831b1bed))


### Bug Fixes

* add migration to clean up corrupt data caused by feature versioning ([#4873](https://github.com/Flagsmith/flagsmith/issues/4873)) ([e17f92d](https://github.com/Flagsmith/flagsmith/commit/e17f92df02c5b08a8f6ba498ce49185d37beb994))
* button style ([#4884](https://github.com/Flagsmith/flagsmith/issues/4884)) ([679acdd](https://github.com/Flagsmith/flagsmith/commit/679acdd26cb18f16626a4809caa0aea65060e466))
* cannot create new segments due to segment validation ([#4886](https://github.com/Flagsmith/flagsmith/issues/4886)) ([05ab7cf](https://github.com/Flagsmith/flagsmith/commit/05ab7cf876611de613aececc0f70f5987955e446))
* Set Hubspot cookie name from request body ([#4880](https://github.com/Flagsmith/flagsmith/issues/4880)) ([7d3b253](https://github.com/Flagsmith/flagsmith/commit/7d3b2531c9abc02aceeee5193472ddc92bc772ac))

## [2.155.0](https://github.com/Flagsmith/flagsmith/compare/v2.154.0...v2.155.0) (2024-12-03)


### Features

* Create change requests for segments ([#4265](https://github.com/Flagsmith/flagsmith/issues/4265)) ([355f4e2](https://github.com/Flagsmith/flagsmith/commit/355f4e2827dc0a0cba169a320c7a0db8b522089e))
* **environment/views:** Add get-by-uuid action  ([#4875](https://github.com/Flagsmith/flagsmith/issues/4875)) ([db8433b](https://github.com/Flagsmith/flagsmith/commit/db8433ba0a307b3e27f078aadf94d6ef4e717391))
* **org/view:** Add api to get organisation by uuid ([#4878](https://github.com/Flagsmith/flagsmith/issues/4878)) ([06ed466](https://github.com/Flagsmith/flagsmith/commit/06ed466864d723ac43bad9ec8fa738a8e9d0812d))


### Bug Fixes

* Environment Ready Checker ([#4865](https://github.com/Flagsmith/flagsmith/issues/4865)) ([2392222](https://github.com/Flagsmith/flagsmith/commit/23922223d4367792b196d798cb2571dc8f589ee1))
* prevent enabling versioning from affecting scheduled change requests ([#4872](https://github.com/Flagsmith/flagsmith/issues/4872)) ([c7aa30b](https://github.com/Flagsmith/flagsmith/commit/c7aa30bb217deca7ea6a0b0657d1a08076f2ab44))

## [2.154.0](https://github.com/Flagsmith/flagsmith/compare/v2.153.0...v2.154.0) (2024-11-21)


### Features

* Add Hubspot cookie logging ([#4854](https://github.com/Flagsmith/flagsmith/issues/4854)) ([8fe4d41](https://github.com/Flagsmith/flagsmith/commit/8fe4d413ff3a7a5cb7ddcd2f04a5a26ed2651316))


### Bug Fixes

* Allow teardown to use FLAGSMITH_API_URL ([#4849](https://github.com/Flagsmith/flagsmith/issues/4849)) ([9ad8da6](https://github.com/Flagsmith/flagsmith/commit/9ad8da6a1b8a034d4436e8579ecadbac1327f9ce))
* Custom Gunicorn logger not sending StatsD stats ([#4819](https://github.com/Flagsmith/flagsmith/issues/4819)) ([9bbfdf0](https://github.com/Flagsmith/flagsmith/commit/9bbfdf0d2bc4cb95fa0d029144c4bc61fb23f0bc))
* flagsmith stale flags check ([#4831](https://github.com/Flagsmith/flagsmith/issues/4831)) ([ea6a169](https://github.com/Flagsmith/flagsmith/commit/ea6a169d9f84172850b2b01e5fd7d70b8852c9bf))
* Google OAuth broken in unified docker image ([#4839](https://github.com/Flagsmith/flagsmith/issues/4839)) ([051cc6f](https://github.com/Flagsmith/flagsmith/commit/051cc6fe0db5a311998bece472982e19926a2bc5))
* Handle environment admin not being able to check VIEW_PROJECT permissions ([#4827](https://github.com/Flagsmith/flagsmith/issues/4827)) ([23ab3c1](https://github.com/Flagsmith/flagsmith/commit/23ab3c1a8a26284e87503b389c597b58866ee27b))
* Handle invalid colour codes on tags, allow default colours ([#4822](https://github.com/Flagsmith/flagsmith/issues/4822)) ([a33633f](https://github.com/Flagsmith/flagsmith/commit/a33633f61f9eaf8efd4322af48a862dbebcbe682))
* prevent lock when adding FFAdmin.uuid column ([#4832](https://github.com/Flagsmith/flagsmith/issues/4832)) ([4a310b0](https://github.com/Flagsmith/flagsmith/commit/4a310b0c314de4499425fbb5584f94a1f77c640c))
* **project/realtime:** only allow enterprise to enable realtime ([#4843](https://github.com/Flagsmith/flagsmith/issues/4843)) ([9b21af7](https://github.com/Flagsmith/flagsmith/commit/9b21af7652ae2cb5758361c2809a345cc79209d3))
* **project/serializer:** limit edit to only fields that make sense ([#4846](https://github.com/Flagsmith/flagsmith/issues/4846)) ([86ba762](https://github.com/Flagsmith/flagsmith/commit/86ba762d0e93856209c4b975e7bdd1d207c8bfa8))
* replace alter field with adding a new field ([#4817](https://github.com/Flagsmith/flagsmith/issues/4817)) ([0d1c64a](https://github.com/Flagsmith/flagsmith/commit/0d1c64a3db04cd7d56f39b5b3fa0fee4340504eb))
* revert https://github.com/Flagsmith/flagsmith/pull/4817 ([#4850](https://github.com/Flagsmith/flagsmith/issues/4850)) ([793a110](https://github.com/Flagsmith/flagsmith/commit/793a110b031e89589e8e57734aa7fee8818c0812))

## [2.153.0](https://github.com/Flagsmith/flagsmith/compare/v2.152.0...v2.153.0) (2024-11-12)


### Features

* log commands in Docker entrypoint ([#4826](https://github.com/Flagsmith/flagsmith/issues/4826)) ([b2d7500](https://github.com/Flagsmith/flagsmith/commit/b2d7500c6fffb80522e2c940a0031e8df5387556))
* **my-permissions:** Add tag based permissions ([#4824](https://github.com/Flagsmith/flagsmith/issues/4824)) ([cbd60d9](https://github.com/Flagsmith/flagsmith/commit/cbd60d942c5a58030af548f8b5af0057ada3cf18))


### Bug Fixes

* Allow any auth except LDAP and SAML to change email ([#4810](https://github.com/Flagsmith/flagsmith/issues/4810)) ([10eb571](https://github.com/Flagsmith/flagsmith/commit/10eb571bba1821324daf3d56edee96b3d391b977))
* Edit identity override with prevent flag defaults enabled ([#4809](https://github.com/Flagsmith/flagsmith/issues/4809)) ([0f9b24b](https://github.com/Flagsmith/flagsmith/commit/0f9b24b5df354f01b6de9c9c754c468e65c5c081))
* make clone_feature_states_async write only ([#4811](https://github.com/Flagsmith/flagsmith/issues/4811)) ([513b088](https://github.com/Flagsmith/flagsmith/commit/513b088edf25b05f2b7c15604826f21c2a0b3b18))

## [2.152.0](https://github.com/Flagsmith/flagsmith/compare/v2.151.0...v2.152.0) (2024-11-06)


### Features

* add environment processing UI ([#4812](https://github.com/Flagsmith/flagsmith/issues/4812)) ([9db91ae](https://github.com/Flagsmith/flagsmith/commit/9db91ae980ae3bf9fe445f68c8aaf438c68a47b9))
* Manage user's groups ([#4312](https://github.com/Flagsmith/flagsmith/issues/4312)) ([89b153c](https://github.com/Flagsmith/flagsmith/commit/89b153cb3694bf893a24e6d3e047992a6d456eae))
* restrict versioning by days ([#4547](https://github.com/Flagsmith/flagsmith/issues/4547)) ([dad864a](https://github.com/Flagsmith/flagsmith/commit/dad864aa2de0ed6ab704c8b83796ee0a7a8a780a))


### Bug Fixes

* feature stale message not showing ([#4801](https://github.com/Flagsmith/flagsmith/issues/4801)) ([70a7d81](https://github.com/Flagsmith/flagsmith/commit/70a7d81355f8787a68de52b53caf476a5c984103))
* Fix organisation meta ([#4802](https://github.com/Flagsmith/flagsmith/issues/4802)) ([c2fdc5b](https://github.com/Flagsmith/flagsmith/commit/c2fdc5b3e3485a22e8599e904800ca8c238a11b8))
* permanent tag icons ([#4804](https://github.com/Flagsmith/flagsmith/issues/4804)) ([57ad28c](https://github.com/Flagsmith/flagsmith/commit/57ad28cf033b2ec9554ad60bcade4bd40cedb117))
* users with VIEW_ENVIRONMENT should be able to retrieve environment ([#4814](https://github.com/Flagsmith/flagsmith/issues/4814)) ([e6f1bac](https://github.com/Flagsmith/flagsmith/commit/e6f1bac2f264ebdc1d012ad61539efb76ac43fd7))

## [2.151.0](https://github.com/Flagsmith/flagsmith/compare/v2.150.0...v2.151.0) (2024-11-04)


### Features

* async the logic for cloning feature states into a cloned environment ([#4005](https://github.com/Flagsmith/flagsmith/issues/4005)) ([02f5f71](https://github.com/Flagsmith/flagsmith/commit/02f5f71f82bae1ec3536cb522fc0b684a2c27605))
* **ci:** add command to rollback migrations ([#4768](https://github.com/Flagsmith/flagsmith/issues/4768)) ([483cc87](https://github.com/Flagsmith/flagsmith/commit/483cc87fde03d2da465f9ec799bdbc746533f8d2))
* **export:** Add support for edge identities data ([#4654](https://github.com/Flagsmith/flagsmith/issues/4654)) ([f72c764](https://github.com/Flagsmith/flagsmith/commit/f72c764e59d44f3c50bafd0cd2aef2dcf51af07b))
* **permissions:** update endpoints to expose tag-supported perms ([#4788](https://github.com/Flagsmith/flagsmith/issues/4788)) ([43e68c1](https://github.com/Flagsmith/flagsmith/commit/43e68c1b67eeb5587440cbe5017035b60d897212))


### Bug Fixes

* Extend user first name length to 150 characters ([#4797](https://github.com/Flagsmith/flagsmith/issues/4797)) ([364c565](https://github.com/Flagsmith/flagsmith/commit/364c565fed5ebdb0da86927a25d56631502b3792))
* hide view features from associated segment overrides ([#4786](https://github.com/Flagsmith/flagsmith/issues/4786)) ([49ff569](https://github.com/Flagsmith/flagsmith/commit/49ff569cabac19f70c0688f1fe58c3511ce8801b))
* Set tag to get or create ([#4790](https://github.com/Flagsmith/flagsmith/issues/4790)) ([fedd296](https://github.com/Flagsmith/flagsmith/commit/fedd296a5cc8eb07aa1db4a2cbb5eca8f124c098))

## [2.150.0](https://github.com/Flagsmith/flagsmith/compare/v2.149.0...v2.150.0) (2024-10-30)


### Features

* add group admin to list groups ([#4779](https://github.com/Flagsmith/flagsmith/issues/4779)) ([391b377](https://github.com/Flagsmith/flagsmith/commit/391b37773d69d44d5fa904aaac1fb5029657a2b2))
* Log Hubspot cookie creation ([#4778](https://github.com/Flagsmith/flagsmith/issues/4778)) ([960def4](https://github.com/Flagsmith/flagsmith/commit/960def40be5370e617ad5893a3666c5dcf9b3ba4))
* **versioning:** limit returned number of versions by plan ([#4433](https://github.com/Flagsmith/flagsmith/issues/4433)) ([55de839](https://github.com/Flagsmith/flagsmith/commit/55de839fb8882065ddc70465a0d3e7c13235e9ad))


### Bug Fixes

* associated segment override check ([#4781](https://github.com/Flagsmith/flagsmith/issues/4781)) ([85556a0](https://github.com/Flagsmith/flagsmith/commit/85556a0ddef843d9edefe285d06cdd3f23c2d186))
* audit and version limits for existing subscriptions ([#4780](https://github.com/Flagsmith/flagsmith/issues/4780)) ([5827e07](https://github.com/Flagsmith/flagsmith/commit/5827e07ee39a6cf74d4d0295404624565a27ab89))
* GitHub integration tagging issues ([#4586](https://github.com/Flagsmith/flagsmith/issues/4586)) ([56a266d](https://github.com/Flagsmith/flagsmith/commit/56a266de9eeb2216099645d8221092163f31e2e9))
* Prevent newlines in environment variables from causing frontend syntax errors ([#4750](https://github.com/Flagsmith/flagsmith/issues/4750)) ([6bbd6c7](https://github.com/Flagsmith/flagsmith/commit/6bbd6c7d3de3df7ca11f4c38d7b86bc0d2cd1c85))
* run `eslint --fix` removing all prettier error from web/ folder ([#4739](https://github.com/Flagsmith/flagsmith/issues/4739)) ([13494b6](https://github.com/Flagsmith/flagsmith/commit/13494b60186b272d4aa06fb53d451c4990c77648))
* **sales-dashboard:** prevent 500 error when user doesn't exist on sales dashboard search ([#4757](https://github.com/Flagsmith/flagsmith/issues/4757)) ([282d82f](https://github.com/Flagsmith/flagsmith/commit/282d82f289bcdac363e3e892a07e0485017d8c7b))
* **versioning:** handle versioned environments for associated-features endpoint ([#4735](https://github.com/Flagsmith/flagsmith/issues/4735)) ([7d40a07](https://github.com/Flagsmith/flagsmith/commit/7d40a07d9a2bfb95f38b54e507b32f0488e7e206))

## [2.149.0](https://github.com/Flagsmith/flagsmith/compare/v2.148.2...v2.149.0) (2024-10-25)


### Features

* Support `PREVENT_EMAIL_PASSWORD` in backend ([#4765](https://github.com/Flagsmith/flagsmith/issues/4765)) ([7a6b2e0](https://github.com/Flagsmith/flagsmith/commit/7a6b2e0f62d7ffdb2defec0862765a13897d3f96))


### Bug Fixes

* Disable is_admin switcher in Organization API Keys ([#4753](https://github.com/Flagsmith/flagsmith/issues/4753)) ([6d955b4](https://github.com/Flagsmith/flagsmith/commit/6d955b4e08f7c56027394080644b7ed01e0b7486))
* Fix stored XSS when rendering tooltips ([#4770](https://github.com/Flagsmith/flagsmith/issues/4770)) ([96f62c7](https://github.com/Flagsmith/flagsmith/commit/96f62c7367e47db7111dab420b40e85a04d28ddd))
* Removing segment overrides whilst adding others ([#4709](https://github.com/Flagsmith/flagsmith/issues/4709)) ([05f2bca](https://github.com/Flagsmith/flagsmith/commit/05f2bca3903c8f574c1293eb518aec6df45e307d))

## [2.148.2](https://github.com/Flagsmith/flagsmith/compare/v2.148.1...v2.148.2) (2024-10-22)


### Bug Fixes

* Fix "assigned groups" showing empty when trying to assign groups to a role ([#4756](https://github.com/Flagsmith/flagsmith/issues/4756)) ([038a15a](https://github.com/Flagsmith/flagsmith/commit/038a15abab3335b57db62ff1194cbd632ba5a2df))
* Frontend error when creating SAML configuration if API URL is relative ([#4751](https://github.com/Flagsmith/flagsmith/issues/4751)) ([df1b84e](https://github.com/Flagsmith/flagsmith/commit/df1b84ec2bdf9f7dbb833341d57e7342c780dd60))
* Tag Based permissions only validate some views ([#4523](https://github.com/Flagsmith/flagsmith/issues/4523)) ([6d2ab58](https://github.com/Flagsmith/flagsmith/commit/6d2ab58988bf36bf78668f6b51b91340abc9eab1))
* value editor typing ([#4748](https://github.com/Flagsmith/flagsmith/issues/4748)) ([99876ca](https://github.com/Flagsmith/flagsmith/commit/99876ca2e33e403280f4adcb911c9b54bb0028d7))

## [2.148.1](https://github.com/Flagsmith/flagsmith/compare/v2.148.0...v2.148.1) (2024-10-17)


### Bug Fixes

* `AttributeError` when using `LOGGING_CONFIGURATION_FILE` environment variable ([#4693](https://github.com/Flagsmith/flagsmith/issues/4693)) ([2aad0a1](https://github.com/Flagsmith/flagsmith/commit/2aad0a1c4c54557c211d43a144a148ebabc7e9de))
* **ci:** Failing Trivy cron job ([#4741](https://github.com/Flagsmith/flagsmith/issues/4741)) ([dbb9ddf](https://github.com/Flagsmith/flagsmith/commit/dbb9ddfe4983ddb9aa72fa85452d85e96e501b91))
* **ci:** Trivy scan triggered when no scan requested ([#4742](https://github.com/Flagsmith/flagsmith/issues/4742)) ([1ffef49](https://github.com/Flagsmith/flagsmith/commit/1ffef493b68789916c3c31814ca82ec4a88a07d8))
* Combine segment override and value change requests ([#4734](https://github.com/Flagsmith/flagsmith/issues/4734)) ([714a68b](https://github.com/Flagsmith/flagsmith/commit/714a68bfdf4024854a457c4d53af37c974d9fdc6))

## [2.148.0](https://github.com/Flagsmith/flagsmith/compare/v2.147.0...v2.148.0) (2024-10-15)


### Features

* Persist identity search type ([#4729](https://github.com/Flagsmith/flagsmith/issues/4729)) ([08cdf67](https://github.com/Flagsmith/flagsmith/commit/08cdf672cb6b4b7b3a06c988ef085eba50679d88))


### Bug Fixes

* add trailing slash to endpoint to retrieve features after feature create ([#4730](https://github.com/Flagsmith/flagsmith/issues/4730)) ([cbd08f3](https://github.com/Flagsmith/flagsmith/commit/cbd08f3e4ef877be135b5fa9a4748f6870ff68dd))
* Duplicated segment conditions on save ([#4726](https://github.com/Flagsmith/flagsmith/issues/4726)) ([8825971](https://github.com/Flagsmith/flagsmith/commit/8825971afb079dd4e31a657c57af129e27e18a8c))

## [2.147.0](https://github.com/Flagsmith/flagsmith/compare/v2.146.0...v2.147.0) (2024-10-15)


### Features

* organisation integrations ([#4704](https://github.com/Flagsmith/flagsmith/issues/4704)) ([d76a6f0](https://github.com/Flagsmith/flagsmith/commit/d76a6f05bf958a69c418ec7fd00099f24f312b7b))


### Bug Fixes

* Invalid Segment base URLs ([#4727](https://github.com/Flagsmith/flagsmith/issues/4727)) ([8b823a7](https://github.com/Flagsmith/flagsmith/commit/8b823a7e36d14fc092753c37049bcc4151d6f786))
* subscription state ([#4710](https://github.com/Flagsmith/flagsmith/issues/4710)) ([796fb01](https://github.com/Flagsmith/flagsmith/commit/796fb01ba5ae2af1a4aa39740d751b673cebdfc8))

## [2.146.0](https://github.com/Flagsmith/flagsmith/compare/v2.145.0...v2.146.0) (2024-10-14)


### Features

* Hide change email when auth_type !== 'EMAIL' ([#4712](https://github.com/Flagsmith/flagsmith/issues/4712)) ([27109fd](https://github.com/Flagsmith/flagsmith/commit/27109fd06c81be472224bff4e2a94776a6a156ef))
* Set base url for segment ([#4684](https://github.com/Flagsmith/flagsmith/issues/4684)) ([4e833b8](https://github.com/Flagsmith/flagsmith/commit/4e833b89e517cdb7870f8369a07f7d8aa9d60cf0))


### Bug Fixes

* **ci:** Anonymous registry pushes attempted for Tribvy databases ([#4716](https://github.com/Flagsmith/flagsmith/issues/4716)) ([205988d](https://github.com/Flagsmith/flagsmith/commit/205988db1cae9c8e998c62af7dc8097d8076fa68))
* Remove mailer lite ([#4705](https://github.com/Flagsmith/flagsmith/issues/4705)) ([1c71905](https://github.com/Flagsmith/flagsmith/commit/1c71905fbb34d423420c52715f497f53eb8c0bd2))

## [2.145.0](https://github.com/Flagsmith/flagsmith/compare/v2.144.0...v2.145.0) (2024-10-08)


### Features

* Add hubspot ([#4698](https://github.com/Flagsmith/flagsmith/issues/4698)) ([c4faf69](https://github.com/Flagsmith/flagsmith/commit/c4faf69bf968d65e16f0eb9d7f212124e66291d7))


### Bug Fixes

* diff check for versioned segment overrides and MV ([#4656](https://github.com/Flagsmith/flagsmith/issues/4656)) ([8d1c22e](https://github.com/Flagsmith/flagsmith/commit/8d1c22e898fceaa4f35c3e0a291283a8b414da07))
* searching edge identities (dashboard_alias prefix and identifier casing) ([#4700](https://github.com/Flagsmith/flagsmith/issues/4700)) ([8e6b241](https://github.com/Flagsmith/flagsmith/commit/8e6b241fb5543c31bf8e4e8afa374bae200ceadb))

## [2.144.0](https://github.com/Flagsmith/flagsmith/compare/v2.143.0...v2.144.0) (2024-10-03)


### Features

* Identity alias ([#4620](https://github.com/Flagsmith/flagsmith/issues/4620)) ([d18049b](https://github.com/Flagsmith/flagsmith/commit/d18049bc3abd6ac49334fb041bc8fca4778ed198))
* Improve segment override UI ([#4633](https://github.com/Flagsmith/flagsmith/issues/4633)) ([a265d74](https://github.com/Flagsmith/flagsmith/commit/a265d7475aa80d00b10c7a939918741f0c64040e))
* Introduce the SDK Evaluation Context schema ([#4414](https://github.com/Flagsmith/flagsmith/issues/4414)) ([d6c6004](https://github.com/Flagsmith/flagsmith/commit/d6c6004f0f514ba997c4c46797c58900dfc5a4e1))
* Manage tags permission ([#4615](https://github.com/Flagsmith/flagsmith/issues/4615)) ([b3da659](https://github.com/Flagsmith/flagsmith/commit/b3da6594e11d453d9dde4a80b443f9c23fe226ab))
* Support cookie authentication ([#4662](https://github.com/Flagsmith/flagsmith/issues/4662)) ([e65c8da](https://github.com/Flagsmith/flagsmith/commit/e65c8da425dd241d445361482ab3c12c4b97b0a6))


### Bug Fixes

* always store and search dashboard alias in lower case ([#4676](https://github.com/Flagsmith/flagsmith/issues/4676)) ([22a3083](https://github.com/Flagsmith/flagsmith/commit/22a30831d0452f94dfd02f1c90e1e22a8c3249f3))
* **ci:** Rate-limited Trivy database pulls ([#4677](https://github.com/Flagsmith/flagsmith/issues/4677)) ([4bca509](https://github.com/Flagsmith/flagsmith/commit/4bca50909892b5f22b0042d4defa914581c65f02))
* Clear project org search on close ([#4690](https://github.com/Flagsmith/flagsmith/issues/4690)) ([b4b48b7](https://github.com/Flagsmith/flagsmith/commit/b4b48b75c0006b667edd65422392151689bd3758))
* encode identity search ([#4691](https://github.com/Flagsmith/flagsmith/issues/4691)) ([0485601](https://github.com/Flagsmith/flagsmith/commit/0485601f5a86359d4cc8c3cb765fce3e76184199))
* encode search when querying features ([#4689](https://github.com/Flagsmith/flagsmith/issues/4689)) ([7c746f4](https://github.com/Flagsmith/flagsmith/commit/7c746f42f23b6b0cc2013282c05bd2b46ef85b75))
* ensure MANAGE_TAGS permission allows create tag ([#4678](https://github.com/Flagsmith/flagsmith/issues/4678)) ([58eb9ed](https://github.com/Flagsmith/flagsmith/commit/58eb9ed8140d1a73a4d36c4f297d1f8d3162808a))
* feature specific segment ([#4682](https://github.com/Flagsmith/flagsmith/issues/4682)) ([a867ed1](https://github.com/Flagsmith/flagsmith/commit/a867ed15204ea75029b65474c8aef41b320ec49d))
* Handle cancellation date for api usage ([#4672](https://github.com/Flagsmith/flagsmith/issues/4672)) ([17be366](https://github.com/Flagsmith/flagsmith/commit/17be366a02f5f8ac4379f1936e4ab2af7284720c))
* remove trait ([#4686](https://github.com/Flagsmith/flagsmith/issues/4686)) ([6dc8b7b](https://github.com/Flagsmith/flagsmith/commit/6dc8b7b4a52a32fd7f9de63ab21a129050829f19))
* update permissions on classes with missing / unclear permissions ([#4667](https://github.com/Flagsmith/flagsmith/issues/4667)) ([19026e4](https://github.com/Flagsmith/flagsmith/commit/19026e4ced349b02f6863f7669bdf29f162141fa))

## [2.143.0](https://github.com/Flagsmith/flagsmith/compare/v2.142.0...v2.143.0) (2024-09-27)


### Features

* Add domain to API flags blocked notification ([#4574](https://github.com/Flagsmith/flagsmith/issues/4574)) ([dd1dd32](https://github.com/Flagsmith/flagsmith/commit/dd1dd327c99d3be15eb3395eac6a95a87a1c24d7))
* add MANAGE_TAGS permission ([#4628](https://github.com/Flagsmith/flagsmith/issues/4628)) ([566520f](https://github.com/Flagsmith/flagsmith/commit/566520f98185d4f45bd1e03609d37acbeb8a68bc))
* allow feature value size to be configured per installation ([#4446](https://github.com/Flagsmith/flagsmith/issues/4446)) ([c28f6f1](https://github.com/Flagsmith/flagsmith/commit/c28f6f1260a5d0fc478d71809831a1146fc3d31a))
* Set default billing terms for missing info cache ([#4614](https://github.com/Flagsmith/flagsmith/issues/4614)) ([f9069e4](https://github.com/Flagsmith/flagsmith/commit/f9069e41e19e4fdf0faa2a1b006ca55072a98920))


### Bug Fixes

* Add logging to segments code ([#4625](https://github.com/Flagsmith/flagsmith/issues/4625)) ([12a8a8e](https://github.com/Flagsmith/flagsmith/commit/12a8a8ee694cdd0eb0ef6a2ea0708a003796b738))
* Set organisation api usage to zero ([#4611](https://github.com/Flagsmith/flagsmith/issues/4611)) ([008998c](https://github.com/Flagsmith/flagsmith/commit/008998c200c5fcfcf66d96c19f45e5f6b6887509))
* version tab check ([#4666](https://github.com/Flagsmith/flagsmith/issues/4666)) ([91af73b](https://github.com/Flagsmith/flagsmith/commit/91af73b95d75b90ce0d563c1446a3847f0643d37))

## [2.142.0](https://github.com/Flagsmith/flagsmith/compare/v2.141.0...v2.142.0) (2024-09-23)


### Features

* Update amplitude / add session replay ([#4626](https://github.com/Flagsmith/flagsmith/issues/4626)) ([17276bc](https://github.com/Flagsmith/flagsmith/commit/17276bcab7ce3f624cabf734ff894bc9e1cbb04b))


### Bug Fixes

* Escape json references ([#4651](https://github.com/Flagsmith/flagsmith/issues/4651)) ([2780aa8](https://github.com/Flagsmith/flagsmith/commit/2780aa8b435241d98b9eec9d8a9d07de15d353f1))
* Non-admin users can create invites ([#4653](https://github.com/Flagsmith/flagsmith/issues/4653)) ([025f178](https://github.com/Flagsmith/flagsmith/commit/025f1788e5b15149890b67b23509efef3b4905b0))
* Prevent signup in backend when `PREVENT_SIGNUP` set to false ([#4650](https://github.com/Flagsmith/flagsmith/issues/4650)) ([24ce3bd](https://github.com/Flagsmith/flagsmith/commit/24ce3bd44c8dd8183f33825c367de11e3bb9c531))
* Solve delete GitHub integration issue ([#4622](https://github.com/Flagsmith/flagsmith/issues/4622)) ([b4d3310](https://github.com/Flagsmith/flagsmith/commit/b4d3310b50a3a0e33647687955906d5d76d372eb))
* Webhook integration not rebuilding environment ([#4641](https://github.com/Flagsmith/flagsmith/issues/4641)) ([37db0e0](https://github.com/Flagsmith/flagsmith/commit/37db0e092335b5fad485f6c7f44d1c2b79b7707a))

## [2.141.0](https://github.com/Flagsmith/flagsmith/compare/v2.140.0...v2.141.0) (2024-09-13)


### Features

* Add hubspot cookie tracking ([#4539](https://github.com/Flagsmith/flagsmith/issues/4539)) ([6714384](https://github.com/Flagsmith/flagsmith/commit/67143847508a492c25a3c188922b012076d48945))
* Add subscription cache for new organisations ([#4587](https://github.com/Flagsmith/flagsmith/issues/4587)) ([b2a1899](https://github.com/Flagsmith/flagsmith/commit/b2a18995663b3e894a4f8510016ee1139a9685a6))
* Add use_identity_overrides_in_local_eval setting ([#4612](https://github.com/Flagsmith/flagsmith/issues/4612)) ([f8a048e](https://github.com/Flagsmith/flagsmith/commit/f8a048ef4abd2c23e99f2785a0b5ad35d584e9e6))
* Detect unchanged feature states when saving versions ([#4609](https://github.com/Flagsmith/flagsmith/issues/4609)) ([0e53baf](https://github.com/Flagsmith/flagsmith/commit/0e53bafa6e2857f9cbb6d6b9170636f16e2a4217))
* Move versioned feature history into feature details modal ([#4499](https://github.com/Flagsmith/flagsmith/issues/4499)) ([ae47db1](https://github.com/Flagsmith/flagsmith/commit/ae47db111e9b3198d67b9d35b7847a8d4d425016))


### Bug Fixes

* 404 when last organisation doesn't exist ([#4624](https://github.com/Flagsmith/flagsmith/issues/4624)) ([d60b3b7](https://github.com/Flagsmith/flagsmith/commit/d60b3b73a79302d6b7b091a23ab6be110a004f1e))
* Allow switching organisations if current one is blocked ([#4606](https://github.com/Flagsmith/flagsmith/issues/4606)) ([6ef774b](https://github.com/Flagsmith/flagsmith/commit/6ef774be945304bf05ad43515eccef51db3a5063))
* Don't include null traits in transient identifier ([#4598](https://github.com/Flagsmith/flagsmith/issues/4598)) ([4bf7b9d](https://github.com/Flagsmith/flagsmith/commit/4bf7b9dc9535695f551e49cb35c3574659f3963f))
* Handle null cancellation dates ([#4589](https://github.com/Flagsmith/flagsmith/issues/4589)) ([603889c](https://github.com/Flagsmith/flagsmith/commit/603889c88f5ffed12c4d5be269ea1ed6d5966042))
* ignore old versions when validating segment override limit ([#4618](https://github.com/Flagsmith/flagsmith/issues/4618)) ([52b9780](https://github.com/Flagsmith/flagsmith/commit/52b978023ed10a36652ad41369c003dc1c31f4bd))
* incorrect Java SDK installation and initialization code examples ([#4596](https://github.com/Flagsmith/flagsmith/issues/4596)) ([d12cf8b](https://github.com/Flagsmith/flagsmith/commit/d12cf8b3897f663160a0e732d9a0fbdf780c6408))
* **versioning:** fix issue creating duplicate priority segment overrides ([#4603](https://github.com/Flagsmith/flagsmith/issues/4603)) ([1e357b8](https://github.com/Flagsmith/flagsmith/commit/1e357b89e5755231558dc4135349d5a8249db590))
* **versioning:** use transaction.atomic to prevent corrupt versions being created ([#4617](https://github.com/Flagsmith/flagsmith/issues/4617)) ([7ac05cd](https://github.com/Flagsmith/flagsmith/commit/7ac05cda86a05c924f742c7f0e20eaf1a090a4b7))
* **webhook/changed_by:** Return name of the master api key ([#4602](https://github.com/Flagsmith/flagsmith/issues/4602)) ([1b22cf5](https://github.com/Flagsmith/flagsmith/commit/1b22cf5847bdf1843fe53e4943067a56189f3856))

## [2.140.0](https://github.com/Flagsmith/flagsmith/compare/v2.139.0...v2.140.0) (2024-09-06)


### Features

* allow ignore conflicts on scheduled change ([#4590](https://github.com/Flagsmith/flagsmith/issues/4590)) ([a891114](https://github.com/Flagsmith/flagsmith/commit/a891114a1779d3a6cf5c4129b8dc090c9023dd7c))
* **environment:** Add toggle for identity override in local eval ([#4576](https://github.com/Flagsmith/flagsmith/issues/4576)) ([5e82c97](https://github.com/Flagsmith/flagsmith/commit/5e82c97e7478327cf76e87205d28a6a6e984468a))
* Improve Github integration ([#4498](https://github.com/Flagsmith/flagsmith/issues/4498)) ([65600a7](https://github.com/Flagsmith/flagsmith/commit/65600a72b97cc906cd0cf5f3433f4cbb76fd38b0))
* search identities by dashboard alias ([#4569](https://github.com/Flagsmith/flagsmith/issues/4569)) ([5c02c1e](https://github.com/Flagsmith/flagsmith/commit/5c02c1effe450e8f2301bbeb8e614e67e119b98f))


### Bug Fixes

* 'Contact Us' link for open source product upsell messages ([#4564](https://github.com/Flagsmith/flagsmith/issues/4564)) ([a6e5b34](https://github.com/Flagsmith/flagsmith/commit/a6e5b34c3b2761cb9df7e93a2941519bb15b6dd8))
* **edge-api/tasks:** Add change_by_user_id ([#4591](https://github.com/Flagsmith/flagsmith/issues/4591)) ([940a56d](https://github.com/Flagsmith/flagsmith/commit/940a56dc6e5951203a4bf88e4d810f56b8132aef))
* **github-4555:** use api_key name for changed_by ([#4561](https://github.com/Flagsmith/flagsmith/issues/4561)) ([7ae2623](https://github.com/Flagsmith/flagsmith/commit/7ae26231f5aed4e8ee6989c07cfad7f4daa57e6f))
* multivariate toggle ([#4594](https://github.com/Flagsmith/flagsmith/issues/4594)) ([4e85975](https://github.com/Flagsmith/flagsmith/commit/4e85975d231ee41e9ddf2f1c87e96b19dc234a30))
* update change request after create ([#4551](https://github.com/Flagsmith/flagsmith/issues/4551)) ([c353798](https://github.com/Flagsmith/flagsmith/commit/c35379853840d6d4506d5d8deab45aca319055e5))

## [2.139.0](https://github.com/Flagsmith/flagsmith/compare/v2.138.2...v2.139.0) (2024-09-03)


### Features

* Add sane defaults for segment_operators, integration_data, saml flags ([#4554](https://github.com/Flagsmith/flagsmith/issues/4554)) ([ff5c0ed](https://github.com/Flagsmith/flagsmith/commit/ff5c0edd7849c457182c15be20b9beb51346ebe3))
* Backend support for Organisation-level integrations ([#4400](https://github.com/Flagsmith/flagsmith/issues/4400)) ([3e6b96f](https://github.com/Flagsmith/flagsmith/commit/3e6b96f1679e7de856ada5968d3889c3831ead2a))


### Bug Fixes

* **app_analytics/cache:** use lock to make cache thread safe ([#4567](https://github.com/Flagsmith/flagsmith/issues/4567)) ([8e371a8](https://github.com/Flagsmith/flagsmith/commit/8e371a83ac04aa3ac497fff30d3276293a91b628))
* **edge-v2:** Migrate only Edge API-enabled projects ([#4556](https://github.com/Flagsmith/flagsmith/issues/4556)) ([9c5ff4f](https://github.com/Flagsmith/flagsmith/commit/9c5ff4f65723255fae44415b824f72363729008c))
* **grafana:** update migration to noop on table name ([#4571](https://github.com/Flagsmith/flagsmith/issues/4571)) ([65b63cf](https://github.com/Flagsmith/flagsmith/commit/65b63cf2abfb0c43def00bbe489dc335a7a5019e))
* incorrect statistics in organisation admin list ([#4546](https://github.com/Flagsmith/flagsmith/issues/4546)) ([bc3ddaf](https://github.com/Flagsmith/flagsmith/commit/bc3ddafbceb9e4a8537595ed48d860063bae7046))

## [2.138.2](https://github.com/Flagsmith/flagsmith/compare/v2.138.1...v2.138.2) (2024-08-28)


### Bug Fixes

* **django-upgrade:** upgrade django major version  ([#4136](https://github.com/Flagsmith/flagsmith/issues/4136)) ([aa234e4](https://github.com/Flagsmith/flagsmith/commit/aa234e45a90d384d52bcd1ab9135d912bedf6bf8))
* feature-specific segments link ([#4299](https://github.com/Flagsmith/flagsmith/issues/4299)) ([bb4a89c](https://github.com/Flagsmith/flagsmith/commit/bb4a89c32851e55167b350bed5af935f484f329b))

### Deprecations

Since this release upgrades the Django major version, this release drops support for 
Postgres <12.

## [2.138.1](https://github.com/Flagsmith/flagsmith/compare/v2.138.0...v2.138.1) (2024-08-27)


### Bug Fixes

* **ldap-login:** create custom serializer to fix login field ([#4535](https://github.com/Flagsmith/flagsmith/issues/4535)) ([a704c7c](https://github.com/Flagsmith/flagsmith/commit/a704c7c9d40680ced3c4c854b9ccd1f8dcb28d3f))
* Missing permissions for LaunchDarkly view ([#4531](https://github.com/Flagsmith/flagsmith/issues/4531)) ([5e02eb4](https://github.com/Flagsmith/flagsmith/commit/5e02eb4cca270f592b268346c7db23ebda8263ad))

## [2.138.0](https://github.com/Flagsmith/flagsmith/compare/v2.137.0...v2.138.0) (2024-08-22)


### Features

* add UUID to user model ([#4488](https://github.com/Flagsmith/flagsmith/issues/4488)) ([32be7c0](https://github.com/Flagsmith/flagsmith/commit/32be7c08aa3152fe2659d0fbe5a99c4023dcc531))
* Copy ACS URL for SAML configurations to clipboard. Disable editing SAML configuration names ([#4494](https://github.com/Flagsmith/flagsmith/issues/4494)) ([3f561ee](https://github.com/Flagsmith/flagsmith/commit/3f561ee4591349381c63d82c2e67b92fe6cabc40))
* usage period filter ([#4526](https://github.com/Flagsmith/flagsmith/issues/4526)) ([968b894](https://github.com/Flagsmith/flagsmith/commit/968b894f779f72c1a227acd660a3dfb06735a935))


### Bug Fixes

* audit logs generation for feature state value ([#4525](https://github.com/Flagsmith/flagsmith/issues/4525)) ([af0369c](https://github.com/Flagsmith/flagsmith/commit/af0369c82e2a7ae5dbe0c7555cc856fda6bd8fcc))
* incorrect negative value conversion ([#4316](https://github.com/Flagsmith/flagsmith/issues/4316)) ([2931cdf](https://github.com/Flagsmith/flagsmith/commit/2931cdff176396e2bb3a95951fb06b3cb23a1a4d))
* Missing permissions for integration API endpoints ([#4530](https://github.com/Flagsmith/flagsmith/issues/4530)) ([cd99a07](https://github.com/Flagsmith/flagsmith/commit/cd99a07ebecf78f14e2d110f3c26632621a73d27))
* project settings permissions ([#4528](https://github.com/Flagsmith/flagsmith/issues/4528)) ([9382908](https://github.com/Flagsmith/flagsmith/commit/9382908ed17c9c5b2b2ba70ef0a65eba54efbd7e))
* Update email wording for paid customers with API usage notifications ([#4517](https://github.com/Flagsmith/flagsmith/issues/4517)) ([5cfdaba](https://github.com/Flagsmith/flagsmith/commit/5cfdababfe043e8767e3147876dd42ce3f79c030))
* usage and analytics data duplicates the current day ([#4529](https://github.com/Flagsmith/flagsmith/issues/4529)) ([910b3ed](https://github.com/Flagsmith/flagsmith/commit/910b3ed11f5ffe3767d967228664018578be4ed7))

## [2.137.0](https://github.com/Flagsmith/flagsmith/compare/v2.136.0...v2.137.0) (2024-08-20)


### Features

* make pg usage cache timeout configurable ([#4485](https://github.com/Flagsmith/flagsmith/issues/4485)) ([cd4fbe7](https://github.com/Flagsmith/flagsmith/commit/cd4fbe7bbf27b17a7d6bd1161c9f7c2431ae9a2f))
* Tweak email wording for grace periods ([#4482](https://github.com/Flagsmith/flagsmith/issues/4482)) ([36e634c](https://github.com/Flagsmith/flagsmith/commit/36e634ca057e6aa55ffed41686a05df0883a1062))


### Bug Fixes

* Add decorator for running task every hour ([#4481](https://github.com/Flagsmith/flagsmith/issues/4481)) ([a395a47](https://github.com/Flagsmith/flagsmith/commit/a395a470924628f6d239fb72f964a282b61a2e6b))
* Add logic to handle grace period breached for paid accounts ([#4512](https://github.com/Flagsmith/flagsmith/issues/4512)) ([ba8ae60](https://github.com/Flagsmith/flagsmith/commit/ba8ae60d6e3e0b7f5b84501f2c6c47763267e8be))
* add reverse sql to versioning migration ([#4491](https://github.com/Flagsmith/flagsmith/issues/4491)) ([a6a0f91](https://github.com/Flagsmith/flagsmith/commit/a6a0f918394d0f044994d159d4e440c3a9ebcdef))
* allow unknown attrs from cb json meta ([#4509](https://github.com/Flagsmith/flagsmith/issues/4509)) ([1e3888a](https://github.com/Flagsmith/flagsmith/commit/1e3888aae3f4429089643c478300b8d94e856caf))
* Catch API billing errors ([#4514](https://github.com/Flagsmith/flagsmith/issues/4514)) ([33074f3](https://github.com/Flagsmith/flagsmith/commit/33074f349e24ea06cede711e797d941c0bc042c4))
* **delete-feature-via-role:** bump rbac ([#4508](https://github.com/Flagsmith/flagsmith/issues/4508)) ([174d437](https://github.com/Flagsmith/flagsmith/commit/174d437a4a654e9ea34645d86f515fa65eb85660))
* Make influx cache task recurring ([#4495](https://github.com/Flagsmith/flagsmith/issues/4495)) ([cb8472d](https://github.com/Flagsmith/flagsmith/commit/cb8472d669f50d2dfc3d9837d6a7049840b08a7a))
* Remove grace period where necessary from blocked notification ([#4496](https://github.com/Flagsmith/flagsmith/issues/4496)) ([9bae21c](https://github.com/Flagsmith/flagsmith/commit/9bae21cdcba0f4d37c8d4838137f8376e3749215))
* Rename match variable in external feature resources ([#4490](https://github.com/Flagsmith/flagsmith/issues/4490)) ([bf82b9d](https://github.com/Flagsmith/flagsmith/commit/bf82b9d64976e16cc7d598e6f5cd124cafbe30ca))
* save feature error handling ([#4058](https://github.com/Flagsmith/flagsmith/issues/4058)) ([2517e9d](https://github.com/Flagsmith/flagsmith/commit/2517e9dfd42a58adb69a52050f4e3fc1663bc127))
* Solve API GitHub integration issues ([#4502](https://github.com/Flagsmith/flagsmith/issues/4502)) ([19bc58e](https://github.com/Flagsmith/flagsmith/commit/19bc58ed8b1f8e689842b3181b6bf266f1a507aa))
* subscription info cache race condition ([#4518](https://github.com/Flagsmith/flagsmith/issues/4518)) ([d273679](https://github.com/Flagsmith/flagsmith/commit/d273679b3236c3fceccfeb71c401df5a2d69ad27))
* **views/features:** use get_environment_flags_list ([#4511](https://github.com/Flagsmith/flagsmith/issues/4511)) ([7034fa4](https://github.com/Flagsmith/flagsmith/commit/7034fa4fbe0f16e0253f11affe68e059fde88a6a))

## [2.136.0](https://github.com/Flagsmith/flagsmith/compare/v2.135.1...v2.136.0) (2024-08-13)


### Features

* Add automatic tagging for github integration ([#4028](https://github.com/Flagsmith/flagsmith/issues/4028)) ([7920e8e](https://github.com/Flagsmith/flagsmith/commit/7920e8e22e15fc2f91dbd56582679b1f3064e4a9))
* Add tags for GitHub integration FE ([#4035](https://github.com/Flagsmith/flagsmith/issues/4035)) ([3c46a31](https://github.com/Flagsmith/flagsmith/commit/3c46a31f6060f7a12206fa27409073da946130d8))
* Support Aptible deployments ([#4340](https://github.com/Flagsmith/flagsmith/issues/4340)) ([3b47ae0](https://github.com/Flagsmith/flagsmith/commit/3b47ae07848c1330210d18bd8bb4194fa5d9262e))
* Use environment feature state instead of fetching feature states ([#4188](https://github.com/Flagsmith/flagsmith/issues/4188)) ([b1d49a6](https://github.com/Flagsmith/flagsmith/commit/b1d49a63b5d7c1fe319185586f486829626840cd))


### Bug Fixes

* ensure that usage notification logic is independent of other organisations notifications ([#4480](https://github.com/Flagsmith/flagsmith/issues/4480)) ([6660af5](https://github.com/Flagsmith/flagsmith/commit/6660af56047e8d7083486b2dab20df44d0fc9303))
* Remove warning about non-unique health namespace ([#4479](https://github.com/Flagsmith/flagsmith/issues/4479)) ([6ef7a74](https://github.com/Flagsmith/flagsmith/commit/6ef7a742f0f56aef2335da380770dc7f307d53c5))


### Infrastructure (Flagsmith SaaS Only)

* reduce task retention days to 7 ([#4484](https://github.com/Flagsmith/flagsmith/issues/4484)) ([4349149](https://github.com/Flagsmith/flagsmith/commit/4349149700ad92e824c115c93f1912c7009c9aa2))

## [2.135.1](https://github.com/Flagsmith/flagsmith/compare/v2.135.0...v2.135.1) (2024-08-12)


### Infrastructure (Flagsmith SaaS Only)

* bump feature evaluation cache to 300 ([#4471](https://github.com/Flagsmith/flagsmith/issues/4471)) ([abbf24b](https://github.com/Flagsmith/flagsmith/commit/abbf24bf987e8f74cb2ecf3ec3d82456d9892654))

## [2.135.0](https://github.com/Flagsmith/flagsmith/compare/v2.134.1...v2.135.0) (2024-08-09)


### Features

* **app_analytics:** Add cache for feature evaluation ([#4418](https://github.com/Flagsmith/flagsmith/issues/4418)) ([2dfbf99](https://github.com/Flagsmith/flagsmith/commit/2dfbf99cdc8d8529aa487a4e471df46c0dbc6878))
* Support blank identifiers, assume transient ([#4449](https://github.com/Flagsmith/flagsmith/issues/4449)) ([0014a5b](https://github.com/Flagsmith/flagsmith/commit/0014a5b4312d1ee7d7dd7b914434f26408ee18b7))


### Bug Fixes

* Identity overrides are not deleted when deleting Edge identities ([#4460](https://github.com/Flagsmith/flagsmith/issues/4460)) ([2ab73ed](https://github.com/Flagsmith/flagsmith/commit/2ab73edc7352bec8324eb808ba70d6508fe5eed6))
* show correct SAML Frontend URL on edit ([#4462](https://github.com/Flagsmith/flagsmith/issues/4462)) ([13ad7ef](https://github.com/Flagsmith/flagsmith/commit/13ad7ef7e6613bdd640cdfca7ce99a892b3893be))

## [2.134.1](https://github.com/Flagsmith/flagsmith/compare/v2.134.0...v2.134.1) (2024-08-07)


### Bug Fixes

* don't allow bypassing `ALLOW_REGISTRATION_WITHOUT_INVITE` behaviour ([#4454](https://github.com/Flagsmith/flagsmith/issues/4454)) ([0e6deec](https://github.com/Flagsmith/flagsmith/commit/0e6deec6404c3e78edf5f36b36ea0f2dcef3dd06))
* protect get environment document endpoint ([#4459](https://github.com/Flagsmith/flagsmith/issues/4459)) ([bee01c7](https://github.com/Flagsmith/flagsmith/commit/bee01c7f21cae19e7665ede3284f96989d33940f))
* Set grace period to a singular event ([#4455](https://github.com/Flagsmith/flagsmith/issues/4455)) ([3225c47](https://github.com/Flagsmith/flagsmith/commit/3225c47043f9647a7426b7f05890bde29b681acc))

## [2.134.0](https://github.com/Flagsmith/flagsmith/compare/v2.133.1...v2.134.0) (2024-08-02)


### Features

* Add command for Edge V2 migration ([#4415](https://github.com/Flagsmith/flagsmith/issues/4415)) ([035fe77](https://github.com/Flagsmith/flagsmith/commit/035fe77881c7ae73206979f420f9dd0ff8bc318e))
* Surface password requirements on signup / dynamic validation ([#4282](https://github.com/Flagsmith/flagsmith/issues/4282)) ([104d66d](https://github.com/Flagsmith/flagsmith/commit/104d66de60f29ff9b3d672fbb4b8bf36596c2833))


### Bug Fixes

* Catch full exception instead of runtime error in API usage task ([#4426](https://github.com/Flagsmith/flagsmith/issues/4426)) ([f03b479](https://github.com/Flagsmith/flagsmith/commit/f03b47986218e1c0a90f38200bb5f254ef4dc3a3))
* Check API usage before restricting serving flags and admin ([#4422](https://github.com/Flagsmith/flagsmith/issues/4422)) ([02f7df7](https://github.com/Flagsmith/flagsmith/commit/02f7df7a245ec6fb4fb9122840315ccfb1a3fa15))
* Create a check for billing started at in API usage task helper ([#4440](https://github.com/Flagsmith/flagsmith/issues/4440)) ([e2853d7](https://github.com/Flagsmith/flagsmith/commit/e2853d7494b6fdab513e5ad5abf232585d97a078))
* Delete scheduled change request ([#4437](https://github.com/Flagsmith/flagsmith/issues/4437)) ([233ce50](https://github.com/Flagsmith/flagsmith/commit/233ce509dea479a12f62feca8000400d86c16ecb))
* deleting change requests with change sets throws 500 error ([#4439](https://github.com/Flagsmith/flagsmith/issues/4439)) ([670ede9](https://github.com/Flagsmith/flagsmith/commit/670ede96e496554f9fe6ff71d57da4c9fccb082c))
* Handle zero case for API usage limit ([#4428](https://github.com/Flagsmith/flagsmith/issues/4428)) ([04e8bc2](https://github.com/Flagsmith/flagsmith/commit/04e8bc2657d8b3657e9f12b54803911b74508123))
* Metadata UI improvements ([#4327](https://github.com/Flagsmith/flagsmith/issues/4327)) ([d4006c0](https://github.com/Flagsmith/flagsmith/commit/d4006c031436778227f64fd16cbc36f897769def))
* **tests:** Strong password for E2E ([#4435](https://github.com/Flagsmith/flagsmith/issues/4435)) ([1afb3e5](https://github.com/Flagsmith/flagsmith/commit/1afb3e5f5ee6c1e924c934db4f37d4874d46cb9d))

## [2.133.1](https://github.com/Flagsmith/flagsmith/compare/v2.133.0...v2.133.1) (2024-07-30)


### Bug Fixes

* add logic to handle subscriptions in trial ([#4404](https://github.com/Flagsmith/flagsmith/issues/4404)) ([c10e012](https://github.com/Flagsmith/flagsmith/commit/c10e012bf2a22d7d88d140177b37c3ef5f93a0ad))
* **build:** Use a pre-created user for the frontend image ([#4394](https://github.com/Flagsmith/flagsmith/issues/4394)) ([45ce495](https://github.com/Flagsmith/flagsmith/commit/45ce4952cf64bd47baf8462e5b850c6993eb9b93))
* casting issue in FE logic for `delete` attribute ([#4398](https://github.com/Flagsmith/flagsmith/issues/4398)) ([cbe0a0c](https://github.com/Flagsmith/flagsmith/commit/cbe0a0c8c25347f90766c1236c08898f8545a7e9))
* **models/featureevaluationraw:** Add index on crated_at ([#4405](https://github.com/Flagsmith/flagsmith/issues/4405)) ([1f90900](https://github.com/Flagsmith/flagsmith/commit/1f90900505a7001fe24626c569bcf9cefd4c1be5))

## [2.133.0](https://github.com/Flagsmith/flagsmith/compare/v2.132.0...v2.133.0) (2024-07-25)


### Features

* Send users notification when api flags have been blocked ([#4338](https://github.com/Flagsmith/flagsmith/issues/4338)) ([114d0c3](https://github.com/Flagsmith/flagsmith/commit/114d0c30c791926bc1ca87c461e08f86c6d535ee))

## [2.132.0](https://github.com/Flagsmith/flagsmith/compare/v2.131.0...v2.132.0) (2024-07-25)


### Features

* Improve versioned change requests to handle multiple open CRs for single feature ([#4245](https://github.com/Flagsmith/flagsmith/issues/4245)) ([f1cc8d8](https://github.com/Flagsmith/flagsmith/commit/f1cc8d8409106d5a8feb6dd36cf8e3e4a8c40f0f))
* Return transient traits explicitly ([#4375](https://github.com/Flagsmith/flagsmith/issues/4375)) ([79b3ae7](https://github.com/Flagsmith/flagsmith/commit/79b3ae7d8fa14658623cd15cfbf4f177256728ff))
* versioned change request change sets ([#4301](https://github.com/Flagsmith/flagsmith/issues/4301)) ([6f1f212](https://github.com/Flagsmith/flagsmith/commit/6f1f212ebbaf4cde927c33fb1a17d0ab1cbf06c2))


### Bug Fixes

* add logic to set segment to lowest priority if not set ([#4381](https://github.com/Flagsmith/flagsmith/issues/4381)) ([a78b284](https://github.com/Flagsmith/flagsmith/commit/a78b284bee634347544acb9b02225d998ad1ef8c))
* Cannot use an API Key to add users to a group ([#4362](https://github.com/Flagsmith/flagsmith/issues/4362)) ([0390075](https://github.com/Flagsmith/flagsmith/commit/03900751daa5bfe40fdf70415a2d81594413b597))
* feature segments created with priority 0 are sent to bottom ([#4383](https://github.com/Flagsmith/flagsmith/issues/4383)) ([3f745c5](https://github.com/Flagsmith/flagsmith/commit/3f745c5621ea931d4dba1d24e81a5fc4317f243b))
* Organisation/Project dropdown not reset after closing ([#4365](https://github.com/Flagsmith/flagsmith/issues/4365)) ([1af5d48](https://github.com/Flagsmith/flagsmith/commit/1af5d489e6db4b662ae1e21a4442ccc3a70f3189))
* users with `CREATE_FEATURE` permission cannot assign feature users / groups ([#4371](https://github.com/Flagsmith/flagsmith/issues/4371)) ([d0f3704](https://github.com/Flagsmith/flagsmith/commit/d0f370413ff3e6ea219cb6d21384ad7ceb4e079c))

## [2.131.0](https://github.com/Flagsmith/flagsmith/compare/v2.130.0...v2.131.0) (2024-07-22)


### Features

* **pg-usage-data:** Add cache to batch tracking data ([#4308](https://github.com/Flagsmith/flagsmith/issues/4308)) ([117f72a](https://github.com/Flagsmith/flagsmith/commit/117f72abb7ce74d75b05a8c5338245c926a39193))
* Wolfi-based Docker images ([#4276](https://github.com/Flagsmith/flagsmith/issues/4276)) ([2e461c8](https://github.com/Flagsmith/flagsmith/commit/2e461c851f8f0069c2d44ef2d6a9b31a489dd6c6))


### Bug Fixes

* **build:** Incorrect package used for GPG ([#4355](https://github.com/Flagsmith/flagsmith/issues/4355)) ([aa2fd70](https://github.com/Flagsmith/flagsmith/commit/aa2fd70e0800e2df388930b239d8b7b677c5fa70))
* **build:** Missing gpg-agent for the SaaS build ([#4356](https://github.com/Flagsmith/flagsmith/issues/4356)) ([c655c73](https://github.com/Flagsmith/flagsmith/commit/c655c73f6d07cf79ae2ab45b2368f78221c47c45))
* Non-admin project Role request to /projects/ID/features/ID Causes Crash ([#4289](https://github.com/Flagsmith/flagsmith/issues/4289)) ([bce6530](https://github.com/Flagsmith/flagsmith/commit/bce65306fab071517bf59fbaec18dc24c50fc1df))
* Styling alert for API usage banner ([#4360](https://github.com/Flagsmith/flagsmith/issues/4360)) ([61cfdbf](https://github.com/Flagsmith/flagsmith/commit/61cfdbf47087e4efc52f75da4cfa6a2d1a9d60a7))
* Update of organisations during flags and admin access ([#4344](https://github.com/Flagsmith/flagsmith/issues/4344)) ([7a9edca](https://github.com/Flagsmith/flagsmith/commit/7a9edca2c6d8cd9de33f8a9bff74689cc5c4ec60))

## [2.130.0](https://github.com/Flagsmith/flagsmith/compare/v2.129.0...v2.130.0) (2024-07-18)


### Features

* Support transient identities and traits ([#4325](https://github.com/Flagsmith/flagsmith/issues/4325)) ([27f6539](https://github.com/Flagsmith/flagsmith/commit/27f6539e7393d35f129f3d5af45d039f4d2843b2))


### Bug Fixes

* Non-admin users cannot link a feature to a GH Issue/PR ([#4336](https://github.com/Flagsmith/flagsmith/issues/4336)) ([56e6390](https://github.com/Flagsmith/flagsmith/commit/56e6390ce6622dcc7d6be3127342a22a6053842a))
* The organisation setting page is broken locally ([#4330](https://github.com/Flagsmith/flagsmith/issues/4330)) ([1cd8e0f](https://github.com/Flagsmith/flagsmith/commit/1cd8e0f503240e38e553bc555b4aedd8686d0097))

## [2.129.0](https://github.com/Flagsmith/flagsmith/compare/v2.128.0...v2.129.0) (2024-07-12)


### Features

* **docker:** Update entrypoint ([#4262](https://github.com/Flagsmith/flagsmith/issues/4262)) ([759e745](https://github.com/Flagsmith/flagsmith/commit/759e745098d2e7cb582c0097c18c042e32533012))
* Open payment modal if a plan was preselected, add annual plans ([#4110](https://github.com/Flagsmith/flagsmith/issues/4110)) ([103a94f](https://github.com/Flagsmith/flagsmith/commit/103a94fe45c6e9ec677dd2aa14ab2009f5f0b44b))


### Bug Fixes

* annual plan ids and refreshing ([#4323](https://github.com/Flagsmith/flagsmith/issues/4323)) ([f5a7eed](https://github.com/Flagsmith/flagsmith/commit/f5a7eed20a24f5ef0c642e48030ed74b168dd41f))
* **build:** Avoid E2E rate limiting by swithing to Postgres image hosted on GHCR ([#4328](https://github.com/Flagsmith/flagsmith/issues/4328)) ([249db14](https://github.com/Flagsmith/flagsmith/commit/249db141a9e3679d28cacbe40e35b67d82d245c3))
* **e2e:** Pass `GITHUB_ACTION_URL` to Docker E2E test runs ([#4322](https://github.com/Flagsmith/flagsmith/issues/4322)) ([f8babe8](https://github.com/Flagsmith/flagsmith/commit/f8babe892a3a066b3dcb80d47fe994e78d4e8ef0))
* Fix "Create Project" button in the project selector not opening the project creation modal ([#4294](https://github.com/Flagsmith/flagsmith/issues/4294)) ([1f9aecc](https://github.com/Flagsmith/flagsmith/commit/1f9aeccff49ab5da37006924b5df1a0f307106d2))
* frontend fails to load when announcement flag isn't set ([#4329](https://github.com/Flagsmith/flagsmith/issues/4329)) ([c047233](https://github.com/Flagsmith/flagsmith/commit/c04723373e4a5bfe236beae9a4c827fa819f6509))
* Prevent "Create Segment" button from disappearing when deleting the last segment ([#4314](https://github.com/Flagsmith/flagsmith/issues/4314)) ([cd121e8](https://github.com/Flagsmith/flagsmith/commit/cd121e8e01bce3ac036587d9741773cbd145b3e3))

## [2.128.0](https://github.com/Flagsmith/flagsmith/compare/v2.127.1...v2.128.0) (2024-07-10)


### Features

* Selected options ([#4311](https://github.com/Flagsmith/flagsmith/issues/4311)) ([d32a320](https://github.com/Flagsmith/flagsmith/commit/d32a3203036fa6fde820c1867862ff909c269b52))


### Bug Fixes

* **get_permitted_projects:** get rid of distinct ([#4320](https://github.com/Flagsmith/flagsmith/issues/4320)) ([e7252cb](https://github.com/Flagsmith/flagsmith/commit/e7252cb056645ff6982772759ca8551cd1855811))
* version diff overflow ([#4313](https://github.com/Flagsmith/flagsmith/issues/4313)) ([2525636](https://github.com/Flagsmith/flagsmith/commit/25256367e706b611ed6e6c399b0b2fb8c672710c))

## [2.127.1](https://github.com/Flagsmith/flagsmith/compare/v2.127.0...v2.127.1) (2024-07-09)


### Bug Fixes

* **segments:** add migration to set version on existing segments ([#4315](https://github.com/Flagsmith/flagsmith/issues/4315)) ([288a47e](https://github.com/Flagsmith/flagsmith/commit/288a47efc6bec12374a05a48191380b645bb99b3))

## [2.127.0](https://github.com/Flagsmith/flagsmith/compare/v2.126.0...v2.127.0) (2024-07-09)


### Features

* Add timestamps to segments models ([#4236](https://github.com/Flagsmith/flagsmith/issues/4236)) ([a5b2421](https://github.com/Flagsmith/flagsmith/commit/a5b24210419e6f33935b4f06d8627bcac4a039bb))
* Announcement feature flag per page ([#4218](https://github.com/Flagsmith/flagsmith/issues/4218)) ([3bfad05](https://github.com/Flagsmith/flagsmith/commit/3bfad055a203f65af84b158daabddc2e3a776556))
* Announcement per page accept an id list on the params key ([#4280](https://github.com/Flagsmith/flagsmith/issues/4280)) ([e2685e9](https://github.com/Flagsmith/flagsmith/commit/e2685e91abcdc78457dc0ecf56f134de877cb609))
* Announcement per page FF accept params ([#4275](https://github.com/Flagsmith/flagsmith/issues/4275)) ([078bf1e](https://github.com/Flagsmith/flagsmith/commit/078bf1e1a8002b9c5142c866804c89df006ffaef))
* **build:** Debian Bookworm base images ([#4263](https://github.com/Flagsmith/flagsmith/issues/4263)) ([0230b9a](https://github.com/Flagsmith/flagsmith/commit/0230b9a479cd8e513e883ae19cd694da088bbc59))
* **build:** Docker build improvements ([#4272](https://github.com/Flagsmith/flagsmith/issues/4272)) ([627370f](https://github.com/Flagsmith/flagsmith/commit/627370f3fb7b92f911db7eba15720e96878b3cd4))
* Create versioning for segments ([#4138](https://github.com/Flagsmith/flagsmith/issues/4138)) ([bc9b340](https://github.com/Flagsmith/flagsmith/commit/bc9b340b2a44c46e93326e9602c48dda55e8a6f8))
* Group versions by date ([#4246](https://github.com/Flagsmith/flagsmith/issues/4246)) ([540d320](https://github.com/Flagsmith/flagsmith/commit/540d320d4fafa686f8d61aed734bafb1c4e82f20))
* Update API usage notifications thresholds ([#4255](https://github.com/Flagsmith/flagsmith/issues/4255)) ([5162687](https://github.com/Flagsmith/flagsmith/commit/516268775ee0581a791fb4fd6244126792f579ba))


### Bug Fixes

* **build:** Avoid Docker Hub pull throttling by using public ECR registry ([#4292](https://github.com/Flagsmith/flagsmith/issues/4292)) ([30bed4e](https://github.com/Flagsmith/flagsmith/commit/30bed4efc3aff4e947d2d3aeb8589481730dbbfb))
* Set early return when influxdb range is empty ([#4274](https://github.com/Flagsmith/flagsmith/issues/4274)) ([007351c](https://github.com/Flagsmith/flagsmith/commit/007351c2338e85cacc051102780778e457f1568a))

## [2.126.0](https://github.com/Flagsmith/flagsmith/compare/v2.125.0...v2.126.0) (2024-06-26)


### Features

* **api usage:** Extra Flagsmith checks for API overage charges ([#4251](https://github.com/Flagsmith/flagsmith/issues/4251)) ([ca2b13b](https://github.com/Flagsmith/flagsmith/commit/ca2b13b06c747d026104de7f012d067905e35a88))


### Bug Fixes

* Hide Sensitive Data switch ([#4199](https://github.com/Flagsmith/flagsmith/issues/4199)) ([ff29f21](https://github.com/Flagsmith/flagsmith/commit/ff29f2184d5b5c372001cfdfb5cd9076a2f4625d))

## [2.125.0](https://github.com/Flagsmith/flagsmith/compare/v2.124.2...v2.125.0) (2024-06-26)


### Features

* **api-usage:** add `subscription.plan` trait to `flagsmith.get_identity_flags` ([#4247](https://github.com/Flagsmith/flagsmith/issues/4247)) ([182ea04](https://github.com/Flagsmith/flagsmith/commit/182ea04c7f776606c931f34c4fad32849f667d2c))


### Bug Fixes

* **ci:** Authenticate Trivy correctly for ephemeral build ([#4227](https://github.com/Flagsmith/flagsmith/issues/4227)) ([b9a6f92](https://github.com/Flagsmith/flagsmith/commit/b9a6f92ec099cac58f16c989d44b86bead443a81))
* **ci:** Enable Docker builds and E2E for external PRs ([#4224](https://github.com/Flagsmith/flagsmith/issues/4224)) ([fe7cc53](https://github.com/Flagsmith/flagsmith/commit/fe7cc53b5b4242db6af5ee818dd1e7c42a8d44ab))
* **ci:** Use correct `ENV` value for production ([#4237](https://github.com/Flagsmith/flagsmith/issues/4237)) ([81753ba](https://github.com/Flagsmith/flagsmith/commit/81753bae01c6665bd4a50349107d709991eabfc4))


### Infrastructure (Flagsmith SaaS Only)

* add production environment variables for FoF and API usage alerting ([#4248](https://github.com/Flagsmith/flagsmith/issues/4248)) ([af61d52](https://github.com/Flagsmith/flagsmith/commit/af61d52bb0da1ba95a45f5ea877fc01abc20d262))

## [2.124.2](https://github.com/Flagsmith/flagsmith/compare/v2.124.1...v2.124.2) (2024-06-25)


### Bug Fixes

* **ci:** `packages:read` permission lacking for Docker publish jobs ([#4223](https://github.com/Flagsmith/flagsmith/issues/4223)) ([a037f9f](https://github.com/Flagsmith/flagsmith/commit/a037f9faaea5dd9b610ca61b5ed43d170f93b0fb))

## [2.124.1](https://github.com/Flagsmith/flagsmith/compare/v2.124.0...v2.124.1) (2024-06-25)


### Bug Fixes

* **ci:** Secrets unavailable to Docker publish jobs ([#4220](https://github.com/Flagsmith/flagsmith/issues/4220)) ([30ba49d](https://github.com/Flagsmith/flagsmith/commit/30ba49dea45f1f54f3f805a7dc14b36ed49c9acf))
* versioning webhooks and update test to correctly test end to end ([#4221](https://github.com/Flagsmith/flagsmith/issues/4221)) ([47eb149](https://github.com/Flagsmith/flagsmith/commit/47eb149ffa6840a2f36f2378737b8aa0ce4b2199))

## [2.124.0](https://github.com/Flagsmith/flagsmith/compare/v2.123.1...v2.124.0) (2024-06-24)


### Features

* Add confirmations when removing features, segments and environments ([#4210](https://github.com/Flagsmith/flagsmith/issues/4210)) ([cdc3410](https://github.com/Flagsmith/flagsmith/commit/cdc3410ccb6941e22ab1c3529ebc7d0330e4eb22))
* Add logic to API usage notification templates ([#4206](https://github.com/Flagsmith/flagsmith/issues/4206)) ([6afa63d](https://github.com/Flagsmith/flagsmith/commit/6afa63d7e2e5e452854944c5034cd2195cf7cffa))
* Add UI for SAML attribute mapping ([#4184](https://github.com/Flagsmith/flagsmith/issues/4184)) ([318fb85](https://github.com/Flagsmith/flagsmith/commit/318fb85e471a96b10274c4f502cfac7971169acf))
* Grafana integration ([#4144](https://github.com/Flagsmith/flagsmith/issues/4144)) ([5c25c41](https://github.com/Flagsmith/flagsmith/commit/5c25c41e01ba68b18887759f2a5650caa6a9f39d))
* **versioning:** add logic to create version in single endpoint ([#3991](https://github.com/Flagsmith/flagsmith/issues/3991)) ([57f8d68](https://github.com/Flagsmith/flagsmith/commit/57f8d68449577228a6f32cd317c4693cf5282824))


### Bug Fixes

* **ci:** Docker build CodeQL permission ([#4217](https://github.com/Flagsmith/flagsmith/issues/4217)) ([7554d15](https://github.com/Flagsmith/flagsmith/commit/7554d159aa46338381d392237e662d43286d9cdd))
* **ci:** Secrets unavailable for deploy jobs ([#4215](https://github.com/Flagsmith/flagsmith/issues/4215)) ([d56ad08](https://github.com/Flagsmith/flagsmith/commit/d56ad08d332d10ee440170afec64bd1efecc5282))
* Include free plans for api use notifications ([#4204](https://github.com/Flagsmith/flagsmith/issues/4204)) ([e1f3a7b](https://github.com/Flagsmith/flagsmith/commit/e1f3a7b92344b909f3547024589086685e7c04fa))
* login redirect ([#4192](https://github.com/Flagsmith/flagsmith/issues/4192)) ([b0bc87a](https://github.com/Flagsmith/flagsmith/commit/b0bc87acbe8c0187eaaa6e01880c64712eea1dba))
* Metadata UI issues ([#4069](https://github.com/Flagsmith/flagsmith/issues/4069)) ([36c8bb3](https://github.com/Flagsmith/flagsmith/commit/36c8bb3c401ed153dcc0e866e0edab49746a4ff9))
* oauth user case sensitivity ([#4207](https://github.com/Flagsmith/flagsmith/issues/4207)) ([af955bf](https://github.com/Flagsmith/flagsmith/commit/af955bf7ef3b35965b5675d957fe56a8383c7d5b))
* Preserve selected environment ([#4190](https://github.com/Flagsmith/flagsmith/issues/4190)) ([6bf9858](https://github.com/Flagsmith/flagsmith/commit/6bf9858ce23400445a3ace960acf78123141cdf0))

## [2.123.1](https://github.com/Flagsmith/flagsmith/compare/v2.123.0...v2.123.1) (2024-06-19)


### Bug Fixes

* not serializable arguments when calling environment feature version webhooks ([#4187](https://github.com/Flagsmith/flagsmith/issues/4187)) ([319708c](https://github.com/Flagsmith/flagsmith/commit/319708c1f2ac8ae5f4e8c1208e9cceab0f939552))
* scarf image formatting ([#4178](https://github.com/Flagsmith/flagsmith/issues/4178)) ([710ed87](https://github.com/Flagsmith/flagsmith/commit/710ed878e3d20f8170544894c4db5c1176e2d149))
* Stale connections after task processor errors ([#4179](https://github.com/Flagsmith/flagsmith/issues/4179)) ([17782bd](https://github.com/Flagsmith/flagsmith/commit/17782bdc39ba010e3e823bf2b7f89f20b61d3234))

## [2.123.0](https://github.com/Flagsmith/flagsmith/compare/v2.122.0...v2.123.0) (2024-06-18)


### Features

* Add alert message in the FE when exceeded the API usage ([#4027](https://github.com/Flagsmith/flagsmith/issues/4027)) ([da46dab](https://github.com/Flagsmith/flagsmith/commit/da46dab0f82dfa38d68c0108ee6fdbfb2c3a344f))


### Bug Fixes

* code highlighting ([#4181](https://github.com/Flagsmith/flagsmith/issues/4181)) ([e6d1f62](https://github.com/Flagsmith/flagsmith/commit/e6d1f620d73ae506767be2daeeb8fcbd1ccea4a1))

## [2.122.0](https://github.com/Flagsmith/flagsmith/compare/v2.121.0...v2.122.0) (2024-06-18)


### Features

* add scarf pixel to docs ([#4169](https://github.com/Flagsmith/flagsmith/issues/4169)) ([ca071dc](https://github.com/Flagsmith/flagsmith/commit/ca071dc1b7d86c6aae87fc097f97871d0c6f43a7))
* Add UI for configuring SAML in Flagsmith ([#4055](https://github.com/Flagsmith/flagsmith/issues/4055)) ([d2c2aba](https://github.com/Flagsmith/flagsmith/commit/d2c2aba01b16683b045aa50b21cf8718bc2aca12))


### Bug Fixes

* **dev:** add management command to manually send API usage to influx ([#4159](https://github.com/Flagsmith/flagsmith/issues/4159)) ([77eeaa7](https://github.com/Flagsmith/flagsmith/commit/77eeaa7576e3f89db0710cb0eff6b209a86e5c20))
* **postgres-analytics/usage:** fix project_id filter ([#4171](https://github.com/Flagsmith/flagsmith/issues/4171)) ([5dafecf](https://github.com/Flagsmith/flagsmith/commit/5dafecf0d5ca612c2cc0caabfdd2c69e1bb71e5b))
* various fixes for API usage alerting / billing ([#4158](https://github.com/Flagsmith/flagsmith/issues/4158)) ([9a6e335](https://github.com/Flagsmith/flagsmith/commit/9a6e33514d183763073c0854b2787cc6708ecd85))

## [2.121.0](https://github.com/Flagsmith/flagsmith/compare/v2.120.0...v2.121.0) (2024-06-13)


### Features

* **analytics:** Command to populate arbitrary periods of analytics data ([#4155](https://github.com/Flagsmith/flagsmith/issues/4155)) ([20fb43e](https://github.com/Flagsmith/flagsmith/commit/20fb43ee2c032ba3ebc02ac838ce5596e0953538))
* Keep segment modal open on create / edit, add segment name to modal ([#4109](https://github.com/Flagsmith/flagsmith/issues/4109)) ([1daedc2](https://github.com/Flagsmith/flagsmith/commit/1daedc22ea5dc4800f625804e99b924dbdfb6338))
* Show new version warning in change requests ([#4153](https://github.com/Flagsmith/flagsmith/issues/4153)) ([69f6ae6](https://github.com/Flagsmith/flagsmith/commit/69f6ae6827fee07e173429b25f3f49e357f4d6d7))


### Bug Fixes

* cascade delete versions when corresponding change request is deleted ([#4152](https://github.com/Flagsmith/flagsmith/issues/4152)) ([baf8ddb](https://github.com/Flagsmith/flagsmith/commit/baf8ddb92b78241d3b0d41e421eeee662f6a6782))
* Edge V2-enabled environments are not rebuilt on feature version publish ([#4132](https://github.com/Flagsmith/flagsmith/issues/4132)) ([7e0c9fd](https://github.com/Flagsmith/flagsmith/commit/7e0c9fdf7cf36930b2bd7ebb153df06650bdb879))
* feature state value conversion ([#3946](https://github.com/Flagsmith/flagsmith/issues/3946)) ([d4f948d](https://github.com/Flagsmith/flagsmith/commit/d4f948d44da6b295d10f585caad30561ac6fe8af))
* **migrate_analytics:** fix migrate_to_pg command ([#4139](https://github.com/Flagsmith/flagsmith/issues/4139)) ([c0f373a](https://github.com/Flagsmith/flagsmith/commit/c0f373aae3681c6cfc35dfc0f4bb010d1096227a))

## [2.120.0](https://github.com/Flagsmith/flagsmith/compare/v2.119.1...v2.120.0) (2024-06-11)


### Features

* Add default rule for segments ([#4095](https://github.com/Flagsmith/flagsmith/issues/4095)) ([c3bf3bf](https://github.com/Flagsmith/flagsmith/commit/c3bf3bf2b25639ac46ed9008f9dfad359940cf9d))


### Bug Fixes

* **deps:** Migrate MFA code to our codebase and bump djangorestframework ([#3988](https://github.com/Flagsmith/flagsmith/issues/3988)) ([e217df7](https://github.com/Flagsmith/flagsmith/commit/e217df7cf3779d3934d8a0a2836d0a3e4484266b))
* Identity overrides tab ([#4134](https://github.com/Flagsmith/flagsmith/issues/4134)) ([1a51fd3](https://github.com/Flagsmith/flagsmith/commit/1a51fd3346e8ff27ffccd8b6878b88cc81df9f4e))

## [2.119.1](https://github.com/Flagsmith/flagsmith/compare/v2.119.0...v2.119.1) (2024-06-06)


### Bug Fixes

* use python3.11 as base image ([#4121](https://github.com/Flagsmith/flagsmith/issues/4121)) ([418e026](https://github.com/Flagsmith/flagsmith/commit/418e026796863ba361c8750c8da6f2abd5e1b283))


### Infrastructure (Flagsmith SaaS Only)

* run influxdb feature evaluation in thread ([#4125](https://github.com/Flagsmith/flagsmith/issues/4125)) ([b135b38](https://github.com/Flagsmith/flagsmith/commit/b135b38703be391ec68a841a8d9d11635742cf89))
* task processor settings tweaks ([#4126](https://github.com/Flagsmith/flagsmith/issues/4126)) ([ea96db9](https://github.com/Flagsmith/flagsmith/commit/ea96db9f70e90476fb2e829715571d063ca615b8))

## [2.119.0](https://github.com/Flagsmith/flagsmith/compare/v2.118.1...v2.119.0) (2024-06-06)


### Features

* Improve API key UX ([#4102](https://github.com/Flagsmith/flagsmith/issues/4102)) ([1600ed7](https://github.com/Flagsmith/flagsmith/commit/1600ed7633827051b92bf94e83b01bc493473da9))


### Bug Fixes

* Add autocomplete for login ([#4103](https://github.com/Flagsmith/flagsmith/issues/4103)) ([5ffdd51](https://github.com/Flagsmith/flagsmith/commit/5ffdd51d61b2840b927eca0c6ca26dd8c06e7382))
* announcement width ([#4122](https://github.com/Flagsmith/flagsmith/issues/4122)) ([f6ac4e5](https://github.com/Flagsmith/flagsmith/commit/f6ac4e52b9c3c0457aef3e096d82dbef5c64a53c))
* delete environment refreshing list ([#4107](https://github.com/Flagsmith/flagsmith/issues/4107)) ([902b3cd](https://github.com/Flagsmith/flagsmith/commit/902b3cdbd26fc6c4c7dd53e9d0094773365a5b8f))
* environment click sizes ([#4104](https://github.com/Flagsmith/flagsmith/issues/4104)) ([9d1622f](https://github.com/Flagsmith/flagsmith/commit/9d1622f7e6445b1b88ad5a369ea6174746458910))
* Environment creating state ([#4060](https://github.com/Flagsmith/flagsmith/issues/4060)) ([652af8f](https://github.com/Flagsmith/flagsmith/commit/652af8f9f2f87e65eb06187c17a7979075f0a57a))
* Flag update scheduling ([#4115](https://github.com/Flagsmith/flagsmith/issues/4115)) ([e90d248](https://github.com/Flagsmith/flagsmith/commit/e90d248de1026200c6134f32b7b104e62ddd69ae))
* Limit feature paging to 50 ([#4120](https://github.com/Flagsmith/flagsmith/issues/4120)) ([c14c3a8](https://github.com/Flagsmith/flagsmith/commit/c14c3a86995e0b44ee080322dda41633d101e56e))
* Protect inputs from autofill ([#3980](https://github.com/Flagsmith/flagsmith/issues/3980)) ([dad3041](https://github.com/Flagsmith/flagsmith/commit/dad304101e073fd7767b8623751f52e4d806a330))
* Reload integrations on create ([#4106](https://github.com/Flagsmith/flagsmith/issues/4106)) ([5155018](https://github.com/Flagsmith/flagsmith/commit/5155018a38d717f167c9e9794067a4013da66c3a))
* save empty segment overrides request ([#4112](https://github.com/Flagsmith/flagsmith/issues/4112)) ([6dbcb4a](https://github.com/Flagsmith/flagsmith/commit/6dbcb4aadace2dccb5c32adfbe3f145ac894982d))
* show audit logs url ([#4123](https://github.com/Flagsmith/flagsmith/issues/4123)) ([bc256ee](https://github.com/Flagsmith/flagsmith/commit/bc256ee6f1788d00a31ad9ee566a895e4484c9f9))
* **versioning:** scheduled changes incorrectly considered live ([#4119](https://github.com/Flagsmith/flagsmith/issues/4119)) ([6856e64](https://github.com/Flagsmith/flagsmith/commit/6856e64ae1028336801fc1c6acd3fd5da8bff8db))
* **versioning:** send live from when creating versions for change requests ([#4116](https://github.com/Flagsmith/flagsmith/issues/4116)) ([765b12a](https://github.com/Flagsmith/flagsmith/commit/765b12a8c049ec65956707c0ab5792376d5dee47))
* **versioning:** use version live from ([#4118](https://github.com/Flagsmith/flagsmith/issues/4118)) ([0345aff](https://github.com/Flagsmith/flagsmith/commit/0345aff4146596f29ff294941fe0ee27ad6db735))


### Infrastructure (Flagsmith SaaS Only)

* reduce Sentry sampling rate ([#4098](https://github.com/Flagsmith/flagsmith/issues/4098)) ([da3f186](https://github.com/Flagsmith/flagsmith/commit/da3f1863a5c0c90b99bf30a8991b9617a037e8ea))

## [2.118.1](https://github.com/Flagsmith/flagsmith/compare/v2.118.0...v2.118.1) (2024-06-03)


### Bug Fixes

* **audit:** audit and history UI tweaks ([#4092](https://github.com/Flagsmith/flagsmith/issues/4092)) ([e65dc34](https://github.com/Flagsmith/flagsmith/commit/e65dc345850c4c656b55bea9337571994a706ba7))
* facilitate FE display of environment version from audit log ([#4077](https://github.com/Flagsmith/flagsmith/issues/4077)) ([be9b7ce](https://github.com/Flagsmith/flagsmith/commit/be9b7ce1f11a343b1c1d2566d851f11e909cebbc))
* select propagation ([#4085](https://github.com/Flagsmith/flagsmith/issues/4085)) ([0e16068](https://github.com/Flagsmith/flagsmith/commit/0e160684e37d5640d4d2be94036765d2d7d5af5d))
* **sentry-FLAGSMITH-API-4FY:** resolve metadata segment n+1 ([#4030](https://github.com/Flagsmith/flagsmith/issues/4030)) ([a22f86c](https://github.com/Flagsmith/flagsmith/commit/a22f86c6a5555960be8227fecf6afb7f8b2d2011))
* **versioning:** ensure get_previous_version returns previous version, not latest version ([#4083](https://github.com/Flagsmith/flagsmith/issues/4083)) ([22d371b](https://github.com/Flagsmith/flagsmith/commit/22d371bd60650abce4c692e1b3032bbd5c1b8e7f))
* **versioning:** ensure that audit log record is created when committing versions via CR ([#4091](https://github.com/Flagsmith/flagsmith/issues/4091)) ([8246dca](https://github.com/Flagsmith/flagsmith/commit/8246dca4f468e851ee5bf0544ca0e4ba0409712e))
* **versioning:** prevent FeatureSegment from writing audit log on delete when v2 versioning enabled ([#4088](https://github.com/Flagsmith/flagsmith/issues/4088)) ([60c0748](https://github.com/Flagsmith/flagsmith/commit/60c07480b298e8a32321e631fe0ec178cdc5f017))

## [2.118.0](https://github.com/Flagsmith/flagsmith/compare/v2.117.1...v2.118.0) (2024-05-31)


### Features

* add audit log when environment feature version is published ([#4064](https://github.com/Flagsmith/flagsmith/issues/4064)) ([88cfc76](https://github.com/Flagsmith/flagsmith/commit/88cfc762f201967f5a4a2b362eecae444b1a2b19))


### Bug Fixes

* don't create audit log for FeatureStateValue when not published ([#4065](https://github.com/Flagsmith/flagsmith/issues/4065)) ([8b73b5c](https://github.com/Flagsmith/flagsmith/commit/8b73b5c5bb4336d5fe5947e3fe3004736c942ae2))
* versioned remove segment override ([#4063](https://github.com/Flagsmith/flagsmith/issues/4063)) ([e4cd25a](https://github.com/Flagsmith/flagsmith/commit/e4cd25ae9d79c66447377bb087061193a6264eff))

## [2.117.1](https://github.com/Flagsmith/flagsmith/compare/v2.117.0...v2.117.1) (2024-05-30)


### Bug Fixes

* Validate feature values before saving ([#4043](https://github.com/Flagsmith/flagsmith/issues/4043)) ([fef9f8f](https://github.com/Flagsmith/flagsmith/commit/fef9f8fdcc3c7153bdc6752cfbfa5df2cffe3b62))

## [2.117.0](https://github.com/Flagsmith/flagsmith/compare/v2.116.3...v2.117.0) (2024-05-30)


### Features

* Add api usage metrics for different periods ([#3870](https://github.com/Flagsmith/flagsmith/issues/3870)) ([50cc369](https://github.com/Flagsmith/flagsmith/commit/50cc369d26d7ec5c418faadcd1079c1e027a6f0e))
* Add endpoint to fetch GitHub repository contributors ([#4013](https://github.com/Flagsmith/flagsmith/issues/4013)) ([6f321d4](https://github.com/Flagsmith/flagsmith/commit/6f321d45898d2c9b7159388df6b850dd873ee68d))
* Add grace period to api usage billing ([#4038](https://github.com/Flagsmith/flagsmith/issues/4038)) ([3b61f83](https://github.com/Flagsmith/flagsmith/commit/3b61f831d44ed6a7d31374fc8fd42017339fed84))
* **analytics:** Add command to migrate analytics data to pg ([#3981](https://github.com/Flagsmith/flagsmith/issues/3981)) ([848db5a](https://github.com/Flagsmith/flagsmith/commit/848db5adc540023f5911826ae10f9d43032cad02))
* Implement be search and lazy loading for GitHub resources ([#3987](https://github.com/Flagsmith/flagsmith/issues/3987)) ([c896c50](https://github.com/Flagsmith/flagsmith/commit/c896c507a6ead8075b3c77d3aa834c057c0cc909))
* Improvements in the GitHub integration BE ([#3962](https://github.com/Flagsmith/flagsmith/issues/3962)) ([59ddfba](https://github.com/Flagsmith/flagsmith/commit/59ddfba70103d021dab1e6ad5726d21f7c3802eb))


### Bug Fixes

* Add support for versioning v2 on GitHub resource linking ([#4015](https://github.com/Flagsmith/flagsmith/issues/4015)) ([edb4a75](https://github.com/Flagsmith/flagsmith/commit/edb4a7591bfb11cedb01a63a3fe23d2d4f2c63c8))
* GitHub repos unique constraint and delete ([#4037](https://github.com/Flagsmith/flagsmith/issues/4037)) ([7454e4a](https://github.com/Flagsmith/flagsmith/commit/7454e4ae7f4df36ff0fb605b6149c8542c5428d6))
* **sentry-FLAGSMITH-API-4FZ:** fix PATCH for segments ([#4029](https://github.com/Flagsmith/flagsmith/issues/4029)) ([3c43bb8](https://github.com/Flagsmith/flagsmith/commit/3c43bb8113c21558583271e13a7a11264a5c4955))
* Set api usage billing to 100k ([#3996](https://github.com/Flagsmith/flagsmith/issues/3996)) ([d86f8e7](https://github.com/Flagsmith/flagsmith/commit/d86f8e7857f882aaa4dfae22760d6e9b3e594246))
* Set billing starts at to reasonable default for API usage notifications ([#4054](https://github.com/Flagsmith/flagsmith/issues/4054)) ([515b34c](https://github.com/Flagsmith/flagsmith/commit/515b34c404b2070f28b128a29eba0bdda8f7a71b))
* Set billing term starts at 30 days for null values ([#4053](https://github.com/Flagsmith/flagsmith/issues/4053)) ([84c0835](https://github.com/Flagsmith/flagsmith/commit/84c0835d710a57cc940b17e4ad22def8307419be))
* Setting `LOG_FORMAT: json` does not write stack traces to logs ([#4040](https://github.com/Flagsmith/flagsmith/issues/4040)) ([9e2ffd2](https://github.com/Flagsmith/flagsmith/commit/9e2ffd2e3b1cf52f3f5773fc312a429413481224))
* Switch function argument to date start ([#4052](https://github.com/Flagsmith/flagsmith/issues/4052)) ([d8f48a7](https://github.com/Flagsmith/flagsmith/commit/d8f48a7ea74e7b2668880513ca63045209ca4d80))


### Infrastructure (Flagsmith SaaS Only)

* add influx token secret ([#4048](https://github.com/Flagsmith/flagsmith/issues/4048)) ([1963e03](https://github.com/Flagsmith/flagsmith/commit/1963e03c23545ff91bcd5bbc185baa6b309fdd5e))
* remove duplicate secret definition ([#4049](https://github.com/Flagsmith/flagsmith/issues/4049)) ([adc6429](https://github.com/Flagsmith/flagsmith/commit/adc6429b0c6426ac9b1ef83339f58fee08fb70a4))
* Setup InfluxDB on staging for analytics ([#4042](https://github.com/Flagsmith/flagsmith/issues/4042)) ([d9d503a](https://github.com/Flagsmith/flagsmith/commit/d9d503a8aa5c31cb7359946c07b192d70a4f930c))

## [2.116.3](https://github.com/Flagsmith/flagsmith/compare/v2.116.2...v2.116.3) (2024-05-22)


### Bug Fixes

* **versioning:** webhooks not triggered when new version published ([#3953](https://github.com/Flagsmith/flagsmith/issues/3953)) ([fb2191b](https://github.com/Flagsmith/flagsmith/commit/fb2191b34fef9b6d45d7eda17e22b77d826d4a19))

## [2.116.2](https://github.com/Flagsmith/flagsmith/compare/v2.116.1...v2.116.2) (2024-05-22)


### Bug Fixes

* **versioning:** segment overrides limit ([#4007](https://github.com/Flagsmith/flagsmith/issues/4007)) ([918b731](https://github.com/Flagsmith/flagsmith/commit/918b73148e180d91e794ea8b840310b61ffe6300))

## [2.116.1](https://github.com/Flagsmith/flagsmith/compare/v2.116.0...v2.116.1) (2024-05-21)


### Bug Fixes

* **versioning:** fix cloning environments using v2 versioning ([#3999](https://github.com/Flagsmith/flagsmith/issues/3999)) ([eef02fb](https://github.com/Flagsmith/flagsmith/commit/eef02fb75de85a75b169561b9055b533f3c71bfb))

## [2.116.0](https://github.com/Flagsmith/flagsmith/compare/v2.115.0...v2.116.0) (2024-05-20)


### Features

* Add API usage billing ([#3729](https://github.com/Flagsmith/flagsmith/issues/3729)) ([03cdee3](https://github.com/Flagsmith/flagsmith/commit/03cdee3beea9cfecf6ca119fcaeac9530345368c))
* Add global domain auth methods ([#3949](https://github.com/Flagsmith/flagsmith/issues/3949)) ([796564a](https://github.com/Flagsmith/flagsmith/commit/796564a7894939d83abc7657c8cb62f072b7ebec))
* Add metadata fields to core entities (FE) ([#3212](https://github.com/Flagsmith/flagsmith/issues/3212)) ([c5bd7a2](https://github.com/Flagsmith/flagsmith/commit/c5bd7a230e5f44b633ef04948b5ee15073fe8a09))
* Edge V2 migration opt-in, capacity budget for migration ([#3881](https://github.com/Flagsmith/flagsmith/issues/3881)) ([bca4165](https://github.com/Flagsmith/flagsmith/commit/bca4165002a45967b34ee93716dbac3442cf2570))
* Identity overrides in environment document ([#3766](https://github.com/Flagsmith/flagsmith/issues/3766)) ([e8d1337](https://github.com/Flagsmith/flagsmith/commit/e8d133726c5b724057175bfc7d945e12a733f9d1))


### Bug Fixes

* change environment in settings page ([#3956](https://github.com/Flagsmith/flagsmith/issues/3956)) ([0d30180](https://github.com/Flagsmith/flagsmith/commit/0d30180d7e7d1a4128fbf60d0db469d6c9088e86))
* change environment in settings page ([#3977](https://github.com/Flagsmith/flagsmith/issues/3977)) ([db12f17](https://github.com/Flagsmith/flagsmith/commit/db12f1728b6698bfaea96a8d93923ef189d9e6f4))
* Improve the UI/UX for clone identities ([#3934](https://github.com/Flagsmith/flagsmith/issues/3934)) ([48ac76c](https://github.com/Flagsmith/flagsmith/commit/48ac76c22654155aee36c0805705333d28b82f3d))
* Improve the UI/UX for GitHub integrations ([#3907](https://github.com/Flagsmith/flagsmith/issues/3907)) ([f624223](https://github.com/Flagsmith/flagsmith/commit/f624223afcf77fa709150c2195e94991d3488d50))
* segment overrides stale feature state value while creating GitHub comment ([#3961](https://github.com/Flagsmith/flagsmith/issues/3961)) ([e9246bc](https://github.com/Flagsmith/flagsmith/commit/e9246bc02cb856ab9e4dcf42f727a6e1c40437d0))
* **versioning:** ensure that future scheduled changes are migrated to versioning v2 ([#3958](https://github.com/Flagsmith/flagsmith/issues/3958)) ([c5aa610](https://github.com/Flagsmith/flagsmith/commit/c5aa6102f176884ef608795cfda2f2a0e481c255))
* **versioning:** handle Master API Keys when publishing a version ([#3959](https://github.com/Flagsmith/flagsmith/issues/3959)) ([98a5114](https://github.com/Flagsmith/flagsmith/commit/98a51148b5536a61226afe9281900a3c4cbc8263))
* **versioning:** multiple versioned segment overrides added to environment document ([#3974](https://github.com/Flagsmith/flagsmith/issues/3974)) ([aa5cc95](https://github.com/Flagsmith/flagsmith/commit/aa5cc95f19eccf3d404a8f0694c2e5c303422c46))

## [2.115.0](https://github.com/Flagsmith/flagsmith/compare/v2.114.1...v2.115.0) (2024-05-15)


### Features

* Add metadata fields to core entities (API) ([#3315](https://github.com/Flagsmith/flagsmith/issues/3315)) ([06eb8a4](https://github.com/Flagsmith/flagsmith/commit/06eb8a4754bf8afbff29974eb6e075953ca0352d))


### Bug Fixes

* add trailing slash to update group logic ([#3943](https://github.com/Flagsmith/flagsmith/issues/3943)) ([95b14d1](https://github.com/Flagsmith/flagsmith/commit/95b14d121d0a8d2419746ac5112b6ca78670f5d9))
* changed the error message from custom_auth serializer ([#3924](https://github.com/Flagsmith/flagsmith/issues/3924)) ([185bd6a](https://github.com/Flagsmith/flagsmith/commit/185bd6a441af53fefec2426a891df0a1d140af58))
* Create GitHub comment as table ([#3948](https://github.com/Flagsmith/flagsmith/issues/3948)) ([bf67b1d](https://github.com/Flagsmith/flagsmith/commit/bf67b1dc0ad3a34c38f8aabb8a5cfaf5f65863de))
* Organisation ID is an object calling useHasPermission at organisation level ([#3950](https://github.com/Flagsmith/flagsmith/issues/3950)) ([1372917](https://github.com/Flagsmith/flagsmith/commit/13729173d0587c322272f603f1957908874f9375))
* organisation id parsing ([#3954](https://github.com/Flagsmith/flagsmith/issues/3954)) ([aae116b](https://github.com/Flagsmith/flagsmith/commit/aae116bc6fd83837e6ead8bc681155c25149dcdc))
* Scroll to top on path change ([#3926](https://github.com/Flagsmith/flagsmith/issues/3926)) ([1a2e793](https://github.com/Flagsmith/flagsmith/commit/1a2e793e9bb47922ad0c688c445a54d5ff2677db))
* segment override link ([#3945](https://github.com/Flagsmith/flagsmith/issues/3945)) ([fc0cceb](https://github.com/Flagsmith/flagsmith/commit/fc0cceb40b881891878678c1c61cc0cc1148d090))
* Validate and handle URL params ([#3932](https://github.com/Flagsmith/flagsmith/issues/3932)) ([7e1617f](https://github.com/Flagsmith/flagsmith/commit/7e1617f5bd4e754dbc7d17db957f4315c53c3fba))
* **versioning:** prevent task from deleting all unrelated feature states / feature segments ([#3955](https://github.com/Flagsmith/flagsmith/issues/3955)) ([0ed5148](https://github.com/Flagsmith/flagsmith/commit/0ed5148183e21a74ad93aa9e0af47a08941cfed6))

## [2.114.1](https://github.com/Flagsmith/flagsmith/compare/v2.114.0...v2.114.1) (2024-05-14)


### Bug Fixes

* Add multivariate values when cloning identities ([#3894](https://github.com/Flagsmith/flagsmith/issues/3894)) ([92e3e9f](https://github.com/Flagsmith/flagsmith/commit/92e3e9f55c25855cd0d1b7b7333184ab54385846))
* Organisation id not numeric in organisation settings ([#3929](https://github.com/Flagsmith/flagsmith/issues/3929)) ([9e3746b](https://github.com/Flagsmith/flagsmith/commit/9e3746bd7dce9a8d2eac6bf616a73f2dd1f5b54e))
* **versioning:** fix exception getting feature states for edge identity post v2 versioning migration ([#3916](https://github.com/Flagsmith/flagsmith/issues/3916)) ([132ef77](https://github.com/Flagsmith/flagsmith/commit/132ef77ee0d50c618c23431e3ea1b60aec3e5bf4))
* **versioning:** handle mapping of environment to engine post v2 versioning migration ([#3913](https://github.com/Flagsmith/flagsmith/issues/3913)) ([75acd12](https://github.com/Flagsmith/flagsmith/commit/75acd12c632a9fe8b4a5af5a48a33d18a406e9d4))

## [2.114.0](https://github.com/Flagsmith/flagsmith/compare/v2.113.0...v2.114.0) (2024-05-10)


### Features

* add endpoint to revert v2 versioning ([#3897](https://github.com/Flagsmith/flagsmith/issues/3897)) ([da9e051](https://github.com/Flagsmith/flagsmith/commit/da9e051e72a1d50532fbf688d693980880f395c1))
* Implement GitHub Webhook ([#3906](https://github.com/Flagsmith/flagsmith/issues/3906)) ([9303267](https://github.com/Flagsmith/flagsmith/commit/9303267a078ecfb6788df51a8b3ff5fb83f67e8d))


### Bug Fixes

* Disable segment override diffs for non versioned environments ([#3914](https://github.com/Flagsmith/flagsmith/issues/3914)) ([e5b4313](https://github.com/Flagsmith/flagsmith/commit/e5b4313231bb3f882e2f61512933d9bb127c1a4d))
* Move call to GitHub integration tasks out from trigger_feature_state_change_webhooks ([#3905](https://github.com/Flagsmith/flagsmith/issues/3905)) ([dec9afa](https://github.com/Flagsmith/flagsmith/commit/dec9afab22019297e18ef6efb01c3398abeb9746))

## [2.113.0](https://github.com/Flagsmith/flagsmith/compare/v2.112.0...v2.113.0) (2024-05-09)


### Features

* Block access after seven days notice of API overage ([#3714](https://github.com/Flagsmith/flagsmith/issues/3714)) ([e2cb7eb](https://github.com/Flagsmith/flagsmith/commit/e2cb7eb003513a218e60c9d926988a8adaa0d565))
* versioned segment override change request ([#3790](https://github.com/Flagsmith/flagsmith/issues/3790)) ([cf320b7](https://github.com/Flagsmith/flagsmith/commit/cf320b7d030db0819ba784146da7e42220b154cf))


### Bug Fixes

* codehelp docs links ([#3900](https://github.com/Flagsmith/flagsmith/issues/3900)) ([5f7d3cd](https://github.com/Flagsmith/flagsmith/commit/5f7d3cd6a604c439ba586614065c8da605dc06f1))
* **docker:** Run Task Processor entrypoint with PID 1 ([#3889](https://github.com/Flagsmith/flagsmith/issues/3889)) ([79f4ef7](https://github.com/Flagsmith/flagsmith/commit/79f4ef7bbec47dcc1e315b3db7ae625b1bb91e38))
* Ensure flags are set in code example ([#3901](https://github.com/Flagsmith/flagsmith/issues/3901)) ([fa46ba7](https://github.com/Flagsmith/flagsmith/commit/fa46ba75aa050af6c05a2fe3925c2fed873687b8))
* send all users on paid subscriptions to hubspot ([#3902](https://github.com/Flagsmith/flagsmith/issues/3902)) ([0c79870](https://github.com/Flagsmith/flagsmith/commit/0c798702a313e86d62c1c4e9c7af019969eae117))

## [2.112.0](https://github.com/Flagsmith/flagsmith/compare/v2.111.1...v2.112.0) (2024-05-07)


### Features

* Clone identities (FE) ([#3725](https://github.com/Flagsmith/flagsmith/issues/3725)) ([084d775](https://github.com/Flagsmith/flagsmith/commit/084d7756864e72ef020554380e175238c39d5b3b))
* sort by Overage in sales dashboard ([#3858](https://github.com/Flagsmith/flagsmith/issues/3858)) ([2417f57](https://github.com/Flagsmith/flagsmith/commit/2417f57a037a2a6444fa2604d38dc49ffbff234c))


### Bug Fixes

* Change some texts in the cloning Identities flow ([#3862](https://github.com/Flagsmith/flagsmith/issues/3862)) ([57313ca](https://github.com/Flagsmith/flagsmith/commit/57313ca6802321688b7c735d8284f540188c4d9f))
* For Hubspot make the switch to unique org id ([#3863](https://github.com/Flagsmith/flagsmith/issues/3863)) ([54c2603](https://github.com/Flagsmith/flagsmith/commit/54c2603bbe7bef1bf3e520c6b6ae78c9c16b9458))
* Organisation can't have a new Github integration when had a prior one deleted ([#3874](https://github.com/Flagsmith/flagsmith/issues/3874)) ([53e728a](https://github.com/Flagsmith/flagsmith/commit/53e728a588cd193c8ea352d1b99ce7157d6cf2ef))
* typo ([#3861](https://github.com/Flagsmith/flagsmith/issues/3861)) ([29ae2e9](https://github.com/Flagsmith/flagsmith/commit/29ae2e995f794519cc6f5bb2fa22ebb5ba078650))
* update secrets location for GITHUB_PEM ([#3868](https://github.com/Flagsmith/flagsmith/issues/3868)) ([6e8d7b7](https://github.com/Flagsmith/flagsmith/commit/6e8d7b768871fa57f871b24c92b10f55ec43233a))
* use ENABLE_FLAGSMITH_REALTIME environment var ([#3867](https://github.com/Flagsmith/flagsmith/issues/3867)) ([41a8aa3](https://github.com/Flagsmith/flagsmith/commit/41a8aa3dd133424adef69b3f1b4ac0ae0df0bba8))
* **versioning:** feature segments updated with version ([#3880](https://github.com/Flagsmith/flagsmith/issues/3880)) ([08d4046](https://github.com/Flagsmith/flagsmith/commit/08d4046d05bfb278851b4a6bb0b3a7956a3f018d))
* **versioning:** prevent deleted segment overrides returning ([#3850](https://github.com/Flagsmith/flagsmith/issues/3850)) ([41981d4](https://github.com/Flagsmith/flagsmith/commit/41981d432b8adbb515d0bda2de3bdeb290a9276e))

## [2.111.1](https://github.com/Flagsmith/flagsmith/compare/v2.111.0...v2.111.1) (2024-04-30)


### Bug Fixes

* edit group ([#3856](https://github.com/Flagsmith/flagsmith/issues/3856)) ([b25e6f8](https://github.com/Flagsmith/flagsmith/commit/b25e6f8ad1256b5556cfc7623064a6fd42b299fb))

## [2.111.0](https://github.com/Flagsmith/flagsmith/compare/v2.110.2...v2.111.0) (2024-04-30)


### Features

* Capability for Pydantic-based OpenAPI response schemas ([#3795](https://github.com/Flagsmith/flagsmith/issues/3795)) ([609deaa](https://github.com/Flagsmith/flagsmith/commit/609deaa999c86bc05e1875c58f91c7c34532f3c5))
* **permissions:** manage permissions from a single location ([#3730](https://github.com/Flagsmith/flagsmith/issues/3730)) ([fc34a53](https://github.com/Flagsmith/flagsmith/commit/fc34a53e92ba6c1870ab9539bfa21b6af08964cc))


### Bug Fixes

* Add GitHub app URL to env var ([#3847](https://github.com/Flagsmith/flagsmith/issues/3847)) ([210dbf7](https://github.com/Flagsmith/flagsmith/commit/210dbf7543dfddcbc36422eec0be958d6e8d6589))
* Filter versioned features ([#3756](https://github.com/Flagsmith/flagsmith/issues/3756)) ([686e1ab](https://github.com/Flagsmith/flagsmith/commit/686e1ab81aae938a4a85680a6ed581d90b7ff11d))
* Get current api usage InfluxDB query ([#3846](https://github.com/Flagsmith/flagsmith/issues/3846)) ([905c9fb](https://github.com/Flagsmith/flagsmith/commit/905c9fb36a67171464f03fd9565f02db74708974))
* **hubspot:** create hubspot company with domain ([#3844](https://github.com/Flagsmith/flagsmith/issues/3844)) ([d4c9173](https://github.com/Flagsmith/flagsmith/commit/d4c9173c6c371546f581f2c81572fa2c7395dd17))
* **sentry-FLAGSMITH-API-4BN:** update permission method ([#3851](https://github.com/Flagsmith/flagsmith/issues/3851)) ([b4e058a](https://github.com/Flagsmith/flagsmith/commit/b4e058a47c807455aefcd846f7a7f48de8c4a320))
* useHasPermission import ([#3853](https://github.com/Flagsmith/flagsmith/issues/3853)) ([e156609](https://github.com/Flagsmith/flagsmith/commit/e156609570782fa9edbdf52e9e01e627e9bf8ffc))
* user delete social auth ([#3693](https://github.com/Flagsmith/flagsmith/issues/3693)) ([3372207](https://github.com/Flagsmith/flagsmith/commit/3372207a8db623a6a07ac5df0902f24b8c0b1e4a))

## [2.110.2](https://github.com/Flagsmith/flagsmith/compare/v2.110.1...v2.110.2) (2024-04-25)


### Bug Fixes

* **saas:** fix account number in secrets references ([#3842](https://github.com/Flagsmith/flagsmith/issues/3842)) ([0f6d333](https://github.com/Flagsmith/flagsmith/commit/0f6d3339b3f0e0854acb473aeffd5c97e8d37a7d))

## [2.110.1](https://github.com/Flagsmith/flagsmith/compare/v2.110.0...v2.110.1) (2024-04-25)


### Bug Fixes

* **saas:** add correct GITHUB env vars to all locations ([#3840](https://github.com/Flagsmith/flagsmith/issues/3840)) ([12242c4](https://github.com/Flagsmith/flagsmith/commit/12242c453729f9b3250a81b2637db9609c56d854))

## [2.110.0](https://github.com/Flagsmith/flagsmith/compare/v2.109.0...v2.110.0) (2024-04-25)


### Features

* Add GitHub Integration ([#3298](https://github.com/Flagsmith/flagsmith/issues/3298)) ([9aa72bd](https://github.com/Flagsmith/flagsmith/commit/9aa72bdd144e89badc24607f68207b2b4a5a84de))
* Add Pytest CI mode to optimise migrations ([#3815](https://github.com/Flagsmith/flagsmith/issues/3815)) ([25afe3b](https://github.com/Flagsmith/flagsmith/commit/25afe3b2e468687cdf3abede46da85a211f2e4d4))
* Clone identity flag states ([#3773](https://github.com/Flagsmith/flagsmith/issues/3773)) ([01794b9](https://github.com/Flagsmith/flagsmith/commit/01794b9c669208659a3936baf327742c200f47fe))


### Bug Fixes

* Delete feature external resources when GitHub integration was deleted ([#3836](https://github.com/Flagsmith/flagsmith/issues/3836)) ([576cc83](https://github.com/Flagsmith/flagsmith/commit/576cc83936bbd155ac576a2e2498e38f1bd1b827))

## [2.109.0](https://github.com/Flagsmith/flagsmith/compare/v2.108.1...v2.109.0) (2024-04-23)


### Features

* Ability to customise default environments for new project ([#3655](https://github.com/Flagsmith/flagsmith/issues/3655)) ([cfb5748](https://github.com/Flagsmith/flagsmith/commit/cfb57484597274506f44c86ec4f089b1fe4c0f14))
* Report database errors when waiting for database in entrypoint ([#3823](https://github.com/Flagsmith/flagsmith/issues/3823)) ([a66c262](https://github.com/Flagsmith/flagsmith/commit/a66c262bf169ed887418338efc735eee79884e87))
* Show organisation name in header ([#3808](https://github.com/Flagsmith/flagsmith/issues/3808)) ([10b14fd](https://github.com/Flagsmith/flagsmith/commit/10b14fd6a73462305087832ed750752b3157be80))
* Show organisation name in HTML title ([#3814](https://github.com/Flagsmith/flagsmith/issues/3814)) ([ccfe3c3](https://github.com/Flagsmith/flagsmith/commit/ccfe3c3ddea9cd7123e4576428c6a79c15ae5f5a))
* stale flags (FE) ([#3606](https://github.com/Flagsmith/flagsmith/issues/3606)) ([424b754](https://github.com/Flagsmith/flagsmith/commit/424b754cbdfdb079c76de7c890848884402b6ed2))


### Bug Fixes

* archived persistence ([#3802](https://github.com/Flagsmith/flagsmith/issues/3802)) ([40363dc](https://github.com/Flagsmith/flagsmith/commit/40363dc8171520bee32227056c0496f283647b52))
* broken link in New Segment modal ([#3820](https://github.com/Flagsmith/flagsmith/issues/3820)) ([97c5db7](https://github.com/Flagsmith/flagsmith/commit/97c5db7f9649077b230c19e67b2b4243d3478319))
* master api key org api access ([#3817](https://github.com/Flagsmith/flagsmith/issues/3817)) ([cae2eac](https://github.com/Flagsmith/flagsmith/commit/cae2eacf2325cc3d6c4b6b590e3046fe0513844d))
* Set error value from validation exception properly for feature seralizer ([#3809](https://github.com/Flagsmith/flagsmith/issues/3809)) ([18d8214](https://github.com/Flagsmith/flagsmith/commit/18d8214c760ee02a0b05ccc647868bbabc044a25))

## [2.108.1](https://github.com/Flagsmith/flagsmith/compare/v2.108.0...v2.108.1) (2024-04-18)


### Bug Fixes

* prevent unauthorised remove-users access ([#3791](https://github.com/Flagsmith/flagsmith/issues/3791)) ([05353a5](https://github.com/Flagsmith/flagsmith/commit/05353a5fbe661d504abdede8875f450c4cc8dce5))

## [2.108.0](https://github.com/Flagsmith/flagsmith/compare/v2.107.4...v2.108.0) (2024-04-17)


### Features

* Swagger schema for environment document ([#3789](https://github.com/Flagsmith/flagsmith/issues/3789)) ([dd89326](https://github.com/Flagsmith/flagsmith/commit/dd893262cff97a1b301a346737c106afc58bc146))


### Bug Fixes

* edge API not updated when versioned change request committed ([#3760](https://github.com/Flagsmith/flagsmith/issues/3760)) ([a7ee657](https://github.com/Flagsmith/flagsmith/commit/a7ee6578b5923c9f85527a022f88b1aaa0fe5a04))
* handle InfluxDBError when writing data ([#3788](https://github.com/Flagsmith/flagsmith/issues/3788)) ([1eaa823](https://github.com/Flagsmith/flagsmith/commit/1eaa823d3b7a2167ba424c83838bb72a4b2ec7ad))
* odd behaviour seen when using REPLICA_DATABASE_URLS ([#3771](https://github.com/Flagsmith/flagsmith/issues/3771)) ([ec9e8ab](https://github.com/Flagsmith/flagsmith/commit/ec9e8ab30d224042e1bc07c00355f7b3e1b3977a))

## [2.107.4](https://github.com/Flagsmith/flagsmith/compare/v2.107.3...v2.107.4) (2024-04-17)


### Bug Fixes

* Add Flagsmith signature header when testing webhook. ([#3666](https://github.com/Flagsmith/flagsmith/issues/3666)) ([c950875](https://github.com/Flagsmith/flagsmith/commit/c95087516e17cc610eea80d733cf11ddf8b74d80))
* correct JS code snippets syntax ([#3770](https://github.com/Flagsmith/flagsmith/issues/3770)) ([e2155d2](https://github.com/Flagsmith/flagsmith/commit/e2155d2cecdd67c37bc5b8e98c5b354923abac67))
* Enable faster feature loading ([#3550](https://github.com/Flagsmith/flagsmith/issues/3550)) ([157a9aa](https://github.com/Flagsmith/flagsmith/commit/157a9aab645e6853ecf9f98b8b453a1a9c95f0d6))
* tests using `has_calls` instead of `assert_has_calls` ([#3775](https://github.com/Flagsmith/flagsmith/issues/3775)) ([b019a35](https://github.com/Flagsmith/flagsmith/commit/b019a35df425e439c2ff36239bf6540c61ffe993))

## [2.107.3](https://github.com/Flagsmith/flagsmith/compare/v2.107.2...v2.107.3) (2024-04-10)


### Infrastructure (Flagsmith SaaS Only)

* cache environment segments in production ([#3745](https://github.com/Flagsmith/flagsmith/issues/3745)) ([f2302ee](https://github.com/Flagsmith/flagsmith/commit/f2302ee34d9b80f0de43b460b1f6cd2f712ba3e6))

## [2.107.2](https://github.com/Flagsmith/flagsmith/compare/v2.107.1...v2.107.2) (2024-04-09)


### Bug Fixes

* Revert "feat: Support multiple OR'd search terms in sales-dashboard" ([#3739](https://github.com/Flagsmith/flagsmith/issues/3739)) ([7dd0c82](https://github.com/Flagsmith/flagsmith/commit/7dd0c8296859717f9723047605dac9ed44ae77b0))

## [2.107.1](https://github.com/Flagsmith/flagsmith/compare/v2.107.0...v2.107.1) (2024-04-09)


### Bug Fixes

* segment override assignment ([#3734](https://github.com/Flagsmith/flagsmith/issues/3734)) ([a859902](https://github.com/Flagsmith/flagsmith/commit/a859902c21d564ddfbb5c2c433eeefab34deedb3))
* **task-processor:** catch all exceptions ([#3737](https://github.com/Flagsmith/flagsmith/issues/3737)) ([84ab486](https://github.com/Flagsmith/flagsmith/commit/84ab4867bb25c4db7c75826b3b74fdb687d86eb1))

## [2.107.0](https://github.com/Flagsmith/flagsmith/compare/v2.106.0...v2.107.0) (2024-04-09)


### Features

* add is_live filter to versions endpoint ([#3688](https://github.com/Flagsmith/flagsmith/issues/3688)) ([af0cc9c](https://github.com/Flagsmith/flagsmith/commit/af0cc9c3105759e95a35283bab2776aeab5ce65c))
* Support multiple OR'd search terms in sales-dashboard ([#3715](https://github.com/Flagsmith/flagsmith/issues/3715)) ([d5f76ff](https://github.com/Flagsmith/flagsmith/commit/d5f76ff88ef8a4356d6b653df8cf7c34d4d1c078))


### Bug Fixes

* Adjust permissions logic for view / manage groups ([#3679](https://github.com/Flagsmith/flagsmith/issues/3679)) ([5ba3083](https://github.com/Flagsmith/flagsmith/commit/5ba3083f88ddd8965d65225105d515cfd1ab9bd0))
* allow deletion of scheduled change requests ([#3713](https://github.com/Flagsmith/flagsmith/issues/3713)) ([cd1f79c](https://github.com/Flagsmith/flagsmith/commit/cd1f79c55a5a794cbf1064b10e4643707ba1f74d))
* async feature versioning test ([#3717](https://github.com/Flagsmith/flagsmith/issues/3717)) ([8ad7f04](https://github.com/Flagsmith/flagsmith/commit/8ad7f04aefca6fd519a4f2c99cf0c66540843838))
* convert CharFields to TextFields for FeatureImport / FeatureExport models ([#3720](https://github.com/Flagsmith/flagsmith/issues/3720)) ([6bebcef](https://github.com/Flagsmith/flagsmith/commit/6bebceff1cdf7bbfbcf9b22db6ca551a46ae1435))
* Create API usage notification butter bar ([#3698](https://github.com/Flagsmith/flagsmith/issues/3698)) ([d99fb24](https://github.com/Flagsmith/flagsmith/commit/d99fb24b820231e24a1a5635b717fcf5af3f679a))
* database Compose warnings and set a project name ([#3701](https://github.com/Flagsmith/flagsmith/issues/3701)) ([93ace86](https://github.com/Flagsmith/flagsmith/commit/93ace8615b30b8c7cee916be0ab73abd431dfb4f))
* ensure api/static directory is created by Git ([#3702](https://github.com/Flagsmith/flagsmith/issues/3702)) ([eca05ca](https://github.com/Flagsmith/flagsmith/commit/eca05cad2581032cac1320e422767ccd9500eeef))
* Incorrect environment variable interpolation in Makefile ([#3709](https://github.com/Flagsmith/flagsmith/issues/3709)) ([79a85bd](https://github.com/Flagsmith/flagsmith/commit/79a85bda45660c76043d17c0d06abb3f8b622954))
* organisation store imports ([#3721](https://github.com/Flagsmith/flagsmith/issues/3721)) ([2df29c4](https://github.com/Flagsmith/flagsmith/commit/2df29c4cb486e6c13b8753a462b65cc9e4d683b9))
* Remove CSRF parameter from sales-dashboard search form ([#3716](https://github.com/Flagsmith/flagsmith/issues/3716)) ([1e75ae9](https://github.com/Flagsmith/flagsmith/commit/1e75ae9b573063684c5935fd01ac1945bc869a93))

## [2.106.0](https://github.com/Flagsmith/flagsmith/compare/v2.105.1...v2.106.0) (2024-04-02)


### Features

* Add Hubspot lead tracking for Hubspot data ([#3647](https://github.com/Flagsmith/flagsmith/issues/3647)) ([ee1c396](https://github.com/Flagsmith/flagsmith/commit/ee1c396c7b22a1d751e5408a9e78450c22480fa8))
* Enabled state filter (Frontend) ([#3542](https://github.com/Flagsmith/flagsmith/issues/3542)) ([741320e](https://github.com/Flagsmith/flagsmith/commit/741320edc22046eed4248d8fb53bcfd6d230366a))


### Bug Fixes

* API usage alerting in production ([#3507](https://github.com/Flagsmith/flagsmith/issues/3507)) ([ce38ab7](https://github.com/Flagsmith/flagsmith/commit/ce38ab787e743ec20ce071ac8515bd8f39eb8358))
* Avoid using a Gunicorn config file ([#3699](https://github.com/Flagsmith/flagsmith/issues/3699)) ([647c52a](https://github.com/Flagsmith/flagsmith/commit/647c52aba4add765061fcb29eb073c6d68ee9115))
* broken CSS on Integrations page in non-Chromium browsers ([#3705](https://github.com/Flagsmith/flagsmith/issues/3705)) ([0fe8646](https://github.com/Flagsmith/flagsmith/commit/0fe8646e6a6ff9c016a5665c6cb8b1766ba4eec3))

## [2.105.1](https://github.com/Flagsmith/flagsmith/compare/v2.105.0...v2.105.1) (2024-03-28)


### Bug Fixes

* rollback json access logging ([#3694](https://github.com/Flagsmith/flagsmith/issues/3694)) ([6f66e0f](https://github.com/Flagsmith/flagsmith/commit/6f66e0ff3d295e11e9ba699b92be2f53309d8459))

## [2.105.0](https://github.com/Flagsmith/flagsmith/compare/v2.104.1...v2.105.0) (2024-03-27)


### Features

* Add domain to Hubspot company ([#3648](https://github.com/Flagsmith/flagsmith/issues/3648)) ([87d2d52](https://github.com/Flagsmith/flagsmith/commit/87d2d52b21f161352b9880aaae210853ceb9e321))
* Add org id to hubspot company ([#3680](https://github.com/Flagsmith/flagsmith/issues/3680)) ([9952424](https://github.com/Flagsmith/flagsmith/commit/99524247399079f6d28491e6d66d3776f3abaf51))
* Add subscription to Hubspot tracker ([#3676](https://github.com/Flagsmith/flagsmith/issues/3676)) ([44ed1bf](https://github.com/Flagsmith/flagsmith/commit/44ed1bfabebace7929d0b83f9a6d1508896d08e2))
* JSON logging for Gunicorn ([#3672](https://github.com/Flagsmith/flagsmith/issues/3672)) ([3ce1754](https://github.com/Flagsmith/flagsmith/commit/3ce1754d9c45200ef4e4f464953d079d478f5dac))
* Summary of group permissions in the Project settings page ([#3629](https://github.com/Flagsmith/flagsmith/issues/3629)) ([da12c93](https://github.com/Flagsmith/flagsmith/commit/da12c932c4b5a72084a0025c0c9bd8ef7daa1625))


### Bug Fixes

* Avoid loading Django settings in Gunicorn ([#3685](https://github.com/Flagsmith/flagsmith/issues/3685)) ([7c65445](https://github.com/Flagsmith/flagsmith/commit/7c654457c7eb673df61ee33295c55edff3cea172))
* prevent tasks dying from temporary loss of db connection ([#3674](https://github.com/Flagsmith/flagsmith/issues/3674)) ([b872a6c](https://github.com/Flagsmith/flagsmith/commit/b872a6ca568b0541ca46c2f38135739d214b2f10))
* Use dotenv in frontend/bin/env.js ([#3668](https://github.com/Flagsmith/flagsmith/issues/3668)) ([8c25cd6](https://github.com/Flagsmith/flagsmith/commit/8c25cd6199973cb60a70608737e3bd83631f06e9))

## [2.104.1](https://github.com/Flagsmith/flagsmith/compare/v2.104.0...v2.104.1) (2024-03-26)


### Bug Fixes

* Create group should auto focus on the name input ([#3632](https://github.com/Flagsmith/flagsmith/issues/3632)) ([ddb0b7f](https://github.com/Flagsmith/flagsmith/commit/ddb0b7f35b5e414d8a2f6d01dc88f642b0514f92))
* No pagination when querying `environments_v2` ([#3661](https://github.com/Flagsmith/flagsmith/issues/3661)) ([7e19f4f](https://github.com/Flagsmith/flagsmith/commit/7e19f4ff2b2f3941e55360936b816879af4d06b6))

## [2.104.0](https://github.com/Flagsmith/flagsmith/compare/v2.103.4...v2.104.0) (2024-03-20)


### Features

* Add state feature filter ([#3541](https://github.com/Flagsmith/flagsmith/issues/3541)) ([2ffe8e9](https://github.com/Flagsmith/flagsmith/commit/2ffe8e9adf9006d4fe1d2a5efc3c5af94bde300a))
* Filter features by owners and group owners ([#3579](https://github.com/Flagsmith/flagsmith/issues/3579)) ([79ad523](https://github.com/Flagsmith/flagsmith/commit/79ad5236e5277db4a42b53f0780640baa6499d27))
* **tags:** prevent system tag modifications ([#3605](https://github.com/Flagsmith/flagsmith/issues/3605)) ([974dfc5](https://github.com/Flagsmith/flagsmith/commit/974dfc57537003626ba10cdab98f394dbdf69ab7))


### Bug Fixes

* Add stale_flags_limit_days to Project serializer ([#3607](https://github.com/Flagsmith/flagsmith/issues/3607)) ([99e0148](https://github.com/Flagsmith/flagsmith/commit/99e0148df93eac328f3f3779813db78f78c7f7e5))
* **change-requests:** prevent incorrect scheduled changes warning ([#3593](https://github.com/Flagsmith/flagsmith/issues/3593)) ([165088b](https://github.com/Flagsmith/flagsmith/commit/165088b893910d1cfe451fc8ff5289af5fd8c3a1))
* Freeze time for tests to ensure dependability ([#3627](https://github.com/Flagsmith/flagsmith/issues/3627)) ([2f647f2](https://github.com/Flagsmith/flagsmith/commit/2f647f250d299128e2d9432bbfc28f15d3637be0))
* remove feature modal ([#3608](https://github.com/Flagsmith/flagsmith/issues/3608)) ([9d737ad](https://github.com/Flagsmith/flagsmith/commit/9d737ad456dbf07596cb0dd7b796a7e3175c1ab8))
* startup plan does not allow correct permissions ([#3602](https://github.com/Flagsmith/flagsmith/issues/3602)) ([9642e2f](https://github.com/Flagsmith/flagsmith/commit/9642e2f3f23f00c586820b6b21a26280dd9689f2))

## [2.103.4](https://github.com/Flagsmith/flagsmith/compare/v2.103.3...v2.103.4) (2024-03-11)


### Bug Fixes

* don't create feature export before launch darkly import ([#3510](https://github.com/Flagsmith/flagsmith/issues/3510)) ([afadf5a](https://github.com/Flagsmith/flagsmith/commit/afadf5afa26eae667cdcedbce268185614b7a85d))

## [2.103.3](https://github.com/Flagsmith/flagsmith/compare/v2.103.2...v2.103.3) (2024-03-11)


### Bug Fixes

* **audit:** add segment deleted audit log ([#3585](https://github.com/Flagsmith/flagsmith/issues/3585)) ([e2b8a92](https://github.com/Flagsmith/flagsmith/commit/e2b8a9287269133f3a19fd0a51fc8bb53a63551b))
* poetry audit ([#3592](https://github.com/Flagsmith/flagsmith/issues/3592)) ([c2155b2](https://github.com/Flagsmith/flagsmith/commit/c2155b2c2e76e44b5fee09a66f4de6e52aa93fe9))
* remove duplicate tos ([#3589](https://github.com/Flagsmith/flagsmith/issues/3589)) ([0f2506e](https://github.com/Flagsmith/flagsmith/commit/0f2506e7dc85948e0aa690cd6e8b35073f4df763))

## [2.103.2](https://github.com/Flagsmith/flagsmith/compare/v2.103.1...v2.103.2) (2024-03-08)


### Bug Fixes

* **audit:** create audit log for deleted conditions in a segment ([#3577](https://github.com/Flagsmith/flagsmith/issues/3577)) ([1330b4a](https://github.com/Flagsmith/flagsmith/commit/1330b4a5d8c68c8840814c867fb4105374e2e089))
* **audit:** use correct endpoint for retrieve ([#3578](https://github.com/Flagsmith/flagsmith/issues/3578)) ([5f98b1b](https://github.com/Flagsmith/flagsmith/commit/5f98b1ba0746acfeeb1b430ab892890ed4de34a3))
* clear schedule date ([#3558](https://github.com/Flagsmith/flagsmith/issues/3558)) ([fa9c68f](https://github.com/Flagsmith/flagsmith/commit/fa9c68f7717d68382803da472e132125655d05a4))
* enable hubspot for staging ([#3545](https://github.com/Flagsmith/flagsmith/issues/3545)) ([2460c81](https://github.com/Flagsmith/flagsmith/commit/2460c8151ee81174d73934817691f4bd0ce54569))
* prevent cascade deletes from users deleting change requests ([#3580](https://github.com/Flagsmith/flagsmith/issues/3580)) ([b961790](https://github.com/Flagsmith/flagsmith/commit/b9617904e45b167a50908f1df5c7494f6ec42859))
* Project settings with no environments ([#3572](https://github.com/Flagsmith/flagsmith/issues/3572)) ([becfff1](https://github.com/Flagsmith/flagsmith/commit/becfff19c11a9720b583d20645c637dcdf64308c))
* Refresh filter after tagging ([#3575](https://github.com/Flagsmith/flagsmith/issues/3575)) ([62f8f69](https://github.com/Flagsmith/flagsmith/commit/62f8f69aa198cf03aaada3e736ff7f6f14f1f776))
* **revert:** disable hubspot for staging ([#3576](https://github.com/Flagsmith/flagsmith/issues/3576)) ([c647fbd](https://github.com/Flagsmith/flagsmith/commit/c647fbdcccd3a14cd2940668d70c9e32e99a3095))

## [2.103.1](https://github.com/Flagsmith/flagsmith/compare/v2.103.0...v2.103.1) (2024-03-05)


### Bug Fixes

* Dasherize conversion event types path ([#3516](https://github.com/Flagsmith/flagsmith/issues/3516)) ([994eb55](https://github.com/Flagsmith/flagsmith/commit/994eb556123b0c04495f00d16369c12943927fa6))
* **fs-delete/webhook:** use fs instance instead of historical ([#3475](https://github.com/Flagsmith/flagsmith/issues/3475)) ([90e10cf](https://github.com/Flagsmith/flagsmith/commit/90e10cf656dba13c2a137e2c5630b325b8290776))

## [2.103.0](https://github.com/Flagsmith/flagsmith/compare/v2.102.0...v2.103.0) (2024-03-01)


### Features

* Add has expired column in the api keys table ([#3433](https://github.com/Flagsmith/flagsmith/issues/3433)) ([3f83130](https://github.com/Flagsmith/flagsmith/commit/3f83130fb00e09878228483131187df9d61e117f))
* Track leads to Hubspot ([#3473](https://github.com/Flagsmith/flagsmith/issues/3473)) ([02c59d2](https://github.com/Flagsmith/flagsmith/commit/02c59d25c7a440d0fc0a09a689ea62202c4e1c43))


### Bug Fixes

* Add padding to the announcement ([#3474](https://github.com/Flagsmith/flagsmith/issues/3474)) ([e5f29a1](https://github.com/Flagsmith/flagsmith/commit/e5f29a11b068c1a2537df66dd72fb47f95852209))
* Add trailing / to delete api key endpoint ([#3506](https://github.com/Flagsmith/flagsmith/issues/3506)) ([0d655a0](https://github.com/Flagsmith/flagsmith/commit/0d655a0a0399c02032f4c2369c09c0d7b616944f))
* N+1 on segment overrides for environment-document endpoint ([#3512](https://github.com/Flagsmith/flagsmith/issues/3512)) ([4e92f34](https://github.com/Flagsmith/flagsmith/commit/4e92f348c2e9863e19bd72f8bca1499d9a42786d))
* toggle flag ([#3480](https://github.com/Flagsmith/flagsmith/issues/3480)) ([87cfcd9](https://github.com/Flagsmith/flagsmith/commit/87cfcd9baee2a28dee53842e6fea79bc5dea9fd3))

## [2.102.0](https://github.com/Flagsmith/flagsmith/compare/v2.101.0...v2.102.0) (2024-02-27)


### Features

* add option to disable secure cookies and configure `samesite` ([#3441](https://github.com/Flagsmith/flagsmith/issues/3441)) ([7ec5491](https://github.com/Flagsmith/flagsmith/commit/7ec54911d617f113dae5a735a9b2007ddc7405e7))

## [2.101.0](https://github.com/Flagsmith/flagsmith/compare/v2.100.1...v2.101.0) (2024-02-26)


### Features

* add fields necessary for stale flags ([#3263](https://github.com/Flagsmith/flagsmith/issues/3263)) ([aa1d6bb](https://github.com/Flagsmith/flagsmith/commit/aa1d6bb9f06dd4071ccab098f2be9cfba678e012))
* Add role API key (BE) ([#3346](https://github.com/Flagsmith/flagsmith/issues/3346)) ([c60a145](https://github.com/Flagsmith/flagsmith/commit/c60a14518331f2f3c3f975ce517bb556bdaa6d0c))
* Add role api keys in UI ([#3042](https://github.com/Flagsmith/flagsmith/issues/3042)) ([b746d09](https://github.com/Flagsmith/flagsmith/commit/b746d098e58d9915ee975f7c8b75d750d126e9b9))
* **api-keys:** add `has_expired` to MasterAPIKey response ([#3432](https://github.com/Flagsmith/flagsmith/issues/3432)) ([0a28ee0](https://github.com/Flagsmith/flagsmith/commit/0a28ee02578f48affc099d084f4af87015a527ed))
* Create api usage function ([#3340](https://github.com/Flagsmith/flagsmith/issues/3340)) ([16a2468](https://github.com/Flagsmith/flagsmith/commit/16a24685449ea33906c5b225929c1ad08717ca70))
* **datadog:** add source type name to datadog ([#3342](https://github.com/Flagsmith/flagsmith/issues/3342)) ([a89410c](https://github.com/Flagsmith/flagsmith/commit/a89410c2ac315350c7a6dc0c4b9993ed90b1ed8c))
* GitHub star ([#3451](https://github.com/Flagsmith/flagsmith/issues/3451)) ([b3414b3](https://github.com/Flagsmith/flagsmith/commit/b3414b3ab0561c266c969b0d37f0dd3c6e2a4516))
* Import export environment flags ([#3161](https://github.com/Flagsmith/flagsmith/issues/3161)) ([7b8c8dc](https://github.com/Flagsmith/flagsmith/commit/7b8c8dc753af1d6073e203a745a79b7969536a8c))
* Issue 166 json formatted logs ([#3376](https://github.com/Flagsmith/flagsmith/issues/3376)) ([c666d29](https://github.com/Flagsmith/flagsmith/commit/c666d2961b62634aa51e7c2d9ccb2ed3b4060bec))
* project usage limits ([#3313](https://github.com/Flagsmith/flagsmith/issues/3313)) ([87501f5](https://github.com/Flagsmith/flagsmith/commit/87501f5273aaaef843e97bf26ad063b2e07cfcbb))
* **segments:** add query param to exclude / include feature specific ([#3430](https://github.com/Flagsmith/flagsmith/issues/3430)) ([aa22aad](https://github.com/Flagsmith/flagsmith/commit/aa22aad2138feb100942feddcccf8a27bf4ac61b))
* versioned feature states ([#2688](https://github.com/Flagsmith/flagsmith/issues/2688)) ([c02562e](https://github.com/Flagsmith/flagsmith/commit/c02562ec94f5e590d87e1e5ab30e2e2111620965))


### Bug Fixes

* Add create segment error handling ([#3413](https://github.com/Flagsmith/flagsmith/issues/3413)) ([932c62d](https://github.com/Flagsmith/flagsmith/commit/932c62d2b65503e5f707e5f4e1084546919166c8))
* **analytics:** move feature_name index into its own migration file ([#3427](https://github.com/Flagsmith/flagsmith/issues/3427)) ([39b7300](https://github.com/Flagsmith/flagsmith/commit/39b730098371a80b7b4c5266ba400ed19955a9b5))
* audit paging ([#3421](https://github.com/Flagsmith/flagsmith/issues/3421)) ([32f3b0a](https://github.com/Flagsmith/flagsmith/commit/32f3b0a9ccccbb3bb8b91ba854ffa9f5f5cb9ea0))
* **db:** Fix read replica strategy ([#3426](https://github.com/Flagsmith/flagsmith/issues/3426)) ([d63a289](https://github.com/Flagsmith/flagsmith/commit/d63a2896e53edbe34edd8d5c88e13c6aba982789))
* Docs - Bring the code examples in-line with the latest SDK ([#3456](https://github.com/Flagsmith/flagsmith/issues/3456)) ([1270b18](https://github.com/Flagsmith/flagsmith/commit/1270b18a2340962cba46eb3047340a3f74930267))
* Get permissions by using environment instead of project scope ([#3444](https://github.com/Flagsmith/flagsmith/issues/3444)) ([1b427f2](https://github.com/Flagsmith/flagsmith/commit/1b427f29d3981d6cf9938ea41fd33eb29bad3843))
* Limit segment rules and conditions ([#3397](https://github.com/Flagsmith/flagsmith/issues/3397)) ([c89e96e](https://github.com/Flagsmith/flagsmith/commit/c89e96ec70e67a69817897e692c47397a3a9b00c))
* **migrations:** Fix tags migrations ([#3419](https://github.com/Flagsmith/flagsmith/issues/3419)) ([f1ebdf5](https://github.com/Flagsmith/flagsmith/commit/f1ebdf56b1c81ff9abc8601a31259a351a1350f1))
* org switcher ([#3453](https://github.com/Flagsmith/flagsmith/issues/3453)) ([3bc1bd8](https://github.com/Flagsmith/flagsmith/commit/3bc1bd819f5e1f68a3984a4d6100ec786b8d3e5b))
* **segments:** use API query param for feature-specific filter ([#3431](https://github.com/Flagsmith/flagsmith/issues/3431)) ([86cc3da](https://github.com/Flagsmith/flagsmith/commit/86cc3dabd8804f2d38ba8fc47913f30d1aeb943a))
* toggle mv flags ([#3450](https://github.com/Flagsmith/flagsmith/issues/3450)) ([4214657](https://github.com/Flagsmith/flagsmith/commit/42146573f5083950769be6948e50c58f5ea12fdc))
* Versioning test - always login regardless of skip test ([#3424](https://github.com/Flagsmith/flagsmith/issues/3424)) ([a04aafb](https://github.com/Flagsmith/flagsmith/commit/a04aafbef0a366ab6b1990092f24e48ec8511b24))

## [2.100.1](https://github.com/Flagsmith/flagsmith/compare/v2.100.0...v2.100.1) (2024-02-13)


### Bug Fixes

* **infra:** use correct version number for flagsmith workflows ([#3408](https://github.com/Flagsmith/flagsmith/issues/3408)) ([7adaeb1](https://github.com/Flagsmith/flagsmith/commit/7adaeb123c9ee2e9dfe62d35266db590ec38ab5d))

## [2.100.0](https://github.com/Flagsmith/flagsmith/compare/v2.99.0...v2.100.0) (2024-02-12)


### Features

* Add support for replicas and cross region replicas ([#3300](https://github.com/Flagsmith/flagsmith/issues/3300)) ([bda59f5](https://github.com/Flagsmith/flagsmith/commit/bda59f5982270545c27e600b77e5d06f6229ab93))
* **api-usage:** add environment variable to prevent API usage tracking. ([#3386](https://github.com/Flagsmith/flagsmith/issues/3386)) ([5fa0a1a](https://github.com/Flagsmith/flagsmith/commit/5fa0a1a4694a9c869bdec3604271bcd5ecbc43b4))
* Create split testing for multivariate ([#3235](https://github.com/Flagsmith/flagsmith/issues/3235)) ([ad3ce0e](https://github.com/Flagsmith/flagsmith/commit/ad3ce0e962c85c97fdce1641f3e842ab1c2cfb03))
* try importing rules from LD flags ([#3233](https://github.com/Flagsmith/flagsmith/issues/3233)) ([42634ec](https://github.com/Flagsmith/flagsmith/commit/42634ece4724b869f21e13fc4818e93406c5e0d5))


### Bug Fixes

* Avoid errors when missing subscription information cache id ([#3380](https://github.com/Flagsmith/flagsmith/issues/3380)) ([d9a835f](https://github.com/Flagsmith/flagsmith/commit/d9a835f525ffb3976eabc99dd3210a3804b59744))
* delete project ([#3393](https://github.com/Flagsmith/flagsmith/issues/3393)) ([be544e2](https://github.com/Flagsmith/flagsmith/commit/be544e2351044ebf08eabe67b2ca1315d2fe86ae))
* **redis_cache:** extend DefaultClient class to add support  for RedisClusterException ([#3392](https://github.com/Flagsmith/flagsmith/issues/3392)) ([0949963](https://github.com/Flagsmith/flagsmith/commit/0949963a804e4d9aa69120d48181c220f9bdd375))
* **redis-cluster:** add lower socket timeout ([#3401](https://github.com/Flagsmith/flagsmith/issues/3401)) ([37b89b3](https://github.com/Flagsmith/flagsmith/commit/37b89b311d77d570c822ca2800f3719e26826ea1))
* regex tester ([#3395](https://github.com/Flagsmith/flagsmith/issues/3395)) ([64650c6](https://github.com/Flagsmith/flagsmith/commit/64650c630542338c5c41929eeecd40fe443f18de))
* regular expression validation UI ([#3394](https://github.com/Flagsmith/flagsmith/issues/3394)) ([5f13624](https://github.com/Flagsmith/flagsmith/commit/5f13624136c52e74b9dcb9712ad720e8ac11644e))

## [2.99.0](https://github.com/Flagsmith/flagsmith/compare/v2.98.0...v2.99.0) (2024-02-05)


### Features

* Add audit log detail page ([#3356](https://github.com/Flagsmith/flagsmith/issues/3356)) ([e8bc7d3](https://github.com/Flagsmith/flagsmith/commit/e8bc7d3116e9b2ba153044e5539ee5872af13028))


### Bug Fixes

* **revert:** "feat(rate-limit): enable rate limit in production ([#3362](https://github.com/Flagsmith/flagsmith/issues/3362))" ([#3381](https://github.com/Flagsmith/flagsmith/issues/3381)) ([ea3bc3c](https://github.com/Flagsmith/flagsmith/commit/ea3bc3cfd9e451f7ddba0ae493e8531e86b039f6))

## [2.98.0](https://github.com/Flagsmith/flagsmith/compare/v2.97.1...v2.98.0) (2024-02-05)


### Features

* **rate-limit:** enable rate limit in production ([#3362](https://github.com/Flagsmith/flagsmith/issues/3362)) ([f9545f7](https://github.com/Flagsmith/flagsmith/commit/f9545f702079587cde0a6cd24558fee3baf49433))
* **task-processor:** add Task Processor inputs as env vars ([#3355](https://github.com/Flagsmith/flagsmith/issues/3355)) ([789898c](https://github.com/Flagsmith/flagsmith/commit/789898c47a3fa726bbd1c99d7d7700ae1eb4f3ef))


### Bug Fixes

* **audit:** add details for override creation ([#3359](https://github.com/Flagsmith/flagsmith/issues/3359)) ([a888f29](https://github.com/Flagsmith/flagsmith/commit/a888f291eafd3b113233cf30b19594a37f8fb13a))
* Long `DELETE` project call ([#3360](https://github.com/Flagsmith/flagsmith/issues/3360)) ([aca0fc5](https://github.com/Flagsmith/flagsmith/commit/aca0fc54f5902d4c9ba5630aa8af35b66b7c0799))
* **webhooks:** prevent unnecessary organisation webhook tasks ([#3365](https://github.com/Flagsmith/flagsmith/issues/3365)) ([ec32ce7](https://github.com/Flagsmith/flagsmith/commit/ec32ce7dfc86ccb350f2a9e1af8c3f85f6c154b7))

## [2.97.1](https://github.com/Flagsmith/flagsmith/compare/v2.97.0...v2.97.1) (2024-02-02)


### Bug Fixes

* **audit:** handle case where AuditLog doesn't have a history record ([#3357](https://github.com/Flagsmith/flagsmith/issues/3357)) ([6501829](https://github.com/Flagsmith/flagsmith/commit/65018291c96730c7ef045ccc79defaa5e84e09db))
* **feature-service/get_edge_override:** handle deleted features ([#3368](https://github.com/Flagsmith/flagsmith/issues/3368)) ([1eae11c](https://github.com/Flagsmith/flagsmith/commit/1eae11c93076cfb4d6a226de385166953fcea2b6))

## [2.97.0](https://github.com/Flagsmith/flagsmith/compare/v2.96.0...v2.97.0) (2024-01-31)


### Features

* **rate-limit/redis:** Use redis to store throttling data for admin endpoints ([#2863](https://github.com/Flagsmith/flagsmith/issues/2863)) ([61537ce](https://github.com/Flagsmith/flagsmith/commit/61537ce790dc3b2119b7cc8ee15b9ddc5530c2c9))
* send telemetry heartbeat post migrations are applied ([#3351](https://github.com/Flagsmith/flagsmith/issues/3351)) ([31af594](https://github.com/Flagsmith/flagsmith/commit/31af59418a6995fd7e6813f07e8eaea5747e13ab))


### Bug Fixes

* **2079/deadlock:** avoid deadlock by updating env individually ([#3339](https://github.com/Flagsmith/flagsmith/issues/3339)) ([85443a2](https://github.com/Flagsmith/flagsmith/commit/85443a23c4d81cd41045604f605c14d541ceae3d))
* **staging/infra/redis:** use correct connection factory ([#3353](https://github.com/Flagsmith/flagsmith/issues/3353)) ([4a5f5e6](https://github.com/Flagsmith/flagsmith/commit/4a5f5e6af28ff755e1f82617d605be26a2e2ba42))
* **webhook/logging:** log response code only if response is not none ([#3354](https://github.com/Flagsmith/flagsmith/issues/3354)) ([ea42a34](https://github.com/Flagsmith/flagsmith/commit/ea42a34bd320a077ebc225ac999f4cac875b8df0))

## [2.96.0](https://github.com/Flagsmith/flagsmith/compare/v2.95.0...v2.96.0) (2024-01-29)


### Features

* make segment condition value dynamic ([#3245](https://github.com/Flagsmith/flagsmith/issues/3245)) ([dea63df](https://github.com/Flagsmith/flagsmith/commit/dea63df8a1fb26c09caf2087d241bc27890035ff))
* redesign organisation layout ([#3257](https://github.com/Flagsmith/flagsmith/issues/3257)) ([61d0585](https://github.com/Flagsmith/flagsmith/commit/61d0585eea358b0e8a32aa0a1d80e85dc40d4a6b))
* **sse/tracking:** Add project and org name to the influx event ([#3337](https://github.com/Flagsmith/flagsmith/issues/3337)) ([351232f](https://github.com/Flagsmith/flagsmith/commit/351232fc82a88cd12483f701ba832d1ae3725dd5))


### Bug Fixes

* display of usage chart ([#3331](https://github.com/Flagsmith/flagsmith/issues/3331)) ([21cf0b8](https://github.com/Flagsmith/flagsmith/commit/21cf0b8e159190df516635253b88df3b8b33e0d8))
* projects list navigation ([#3328](https://github.com/Flagsmith/flagsmith/issues/3328)) ([92d6076](https://github.com/Flagsmith/flagsmith/commit/92d6076df295aeda17576625482280758b84636d))
* segment paging ([#3332](https://github.com/Flagsmith/flagsmith/issues/3332)) ([8050aed](https://github.com/Flagsmith/flagsmith/commit/8050aed9448203245e6585bd5962a5538502c48a))
* tweak sdk copy ([#3341](https://github.com/Flagsmith/flagsmith/issues/3341)) ([13617c5](https://github.com/Flagsmith/flagsmith/commit/13617c5c37c5b05b244c0a25436f1c5c9aa7c21f))

## [2.95.0](https://github.com/Flagsmith/flagsmith/compare/v2.94.0...v2.95.0) (2024-01-23)


### Features

* Add endpoints for feature imports ([#3255](https://github.com/Flagsmith/flagsmith/issues/3255)) ([a2eeaf4](https://github.com/Flagsmith/flagsmith/commit/a2eeaf402b50609d5986c0897f819b275d58c926))


### Bug Fixes

* allow editing scheduled changes ([#3227](https://github.com/Flagsmith/flagsmith/issues/3227)) ([90ee8c7](https://github.com/Flagsmith/flagsmith/commit/90ee8c76ebfd9aa554334dbf9a9b588191f4d0e0))
* Handle feature import processing during import ([#3305](https://github.com/Flagsmith/flagsmith/issues/3305)) ([28459c5](https://github.com/Flagsmith/flagsmith/commit/28459c502405de2a208f86f66f573a4a4d60d45e))
* Incorrect tag filtering when results have no features ([#3309](https://github.com/Flagsmith/flagsmith/issues/3309)) ([cca86c3](https://github.com/Flagsmith/flagsmith/commit/cca86c391cfd167f3a968128ef6b4b568628dfdb))
* **sse/stream_access_logs:** handle invalid log ([#3307](https://github.com/Flagsmith/flagsmith/issues/3307)) ([0ef4764](https://github.com/Flagsmith/flagsmith/commit/0ef476466fd8688053b68c3cb03f39b945056e87))
* variation percentage calculation ([#3268](https://github.com/Flagsmith/flagsmith/issues/3268)) ([ec272ba](https://github.com/Flagsmith/flagsmith/commit/ec272ba29f08f58c5a30bdc6e6da7a03233b8513))

## [2.94.0](https://github.com/Flagsmith/flagsmith/compare/v2.93.0...v2.94.0) (2024-01-16)


### Features

* pure BSD3 license ([#3294](https://github.com/Flagsmith/flagsmith/issues/3294)) ([1a1f265](https://github.com/Flagsmith/flagsmith/commit/1a1f2654a5fcfab4c35386c8f74f8ca4caa5a2e8))


### Bug Fixes

* Paging spacer logic ([#3275](https://github.com/Flagsmith/flagsmith/issues/3275)) ([00ac34e](https://github.com/Flagsmith/flagsmith/commit/00ac34ee76b91fe789f60590f92531c9c9c1a7f6))
* Reading role permissions generates 500 errors ([#3009](https://github.com/Flagsmith/flagsmith/issues/3009)) ([de5cf9d](https://github.com/Flagsmith/flagsmith/commit/de5cf9db8a97414241e84b5b51853bb77f9e878c))
* Reset password error handling ([#3271](https://github.com/Flagsmith/flagsmith/issues/3271)) ([a54352f](https://github.com/Flagsmith/flagsmith/commit/a54352fe8efb0488fab1c41019df7a5ce305454c))
* Tidy up ld import ([#3276](https://github.com/Flagsmith/flagsmith/issues/3276)) ([3ee8e6a](https://github.com/Flagsmith/flagsmith/commit/3ee8e6a8be8f2260660997c857d369b55800b476))
* **webhooks:** prevent raise on give up ([#3295](https://github.com/Flagsmith/flagsmith/issues/3295)) ([581a8c9](https://github.com/Flagsmith/flagsmith/commit/581a8c9c31666aadfd64d6b656f6836d71631e3f))

## [2.93.0](https://github.com/Flagsmith/flagsmith/compare/v2.92.0...v2.93.0) (2024-01-11)


### Features

* **audit:** add change details to AuditLog ([#3218](https://github.com/Flagsmith/flagsmith/issues/3218)) ([c665063](https://github.com/Flagsmith/flagsmith/commit/c665063fd22b7cf740eb5b27981c8633a577c470))
* Call webhooks async and add backoff to webhooks ([#2932](https://github.com/Flagsmith/flagsmith/issues/2932)) ([445c698](https://github.com/Flagsmith/flagsmith/commit/445c69837b43e341d6ad48a1a9fd7d12af47a115))
* **dynamo_documents:** propagate delete to dynamo  ([#3220](https://github.com/Flagsmith/flagsmith/issues/3220)) ([b7ecd75](https://github.com/Flagsmith/flagsmith/commit/b7ecd75810d0d98221b775a7f87ba1e73b98647a))
* implement feature actions dropdown ([#3253](https://github.com/Flagsmith/flagsmith/issues/3253)) ([972f1a3](https://github.com/Flagsmith/flagsmith/commit/972f1a364e4774f7a4ce722fe88b4bbee6bb9a11))
* **tags/view:** Add api to get tag by uuid ([#3229](https://github.com/Flagsmith/flagsmith/issues/3229)) ([6500451](https://github.com/Flagsmith/flagsmith/commit/6500451a93c317df6fe57740abc5f5b70853bfa5))


### Bug Fixes

* Adjust segment not rule ([#3267](https://github.com/Flagsmith/flagsmith/issues/3267)) ([6edc932](https://github.com/Flagsmith/flagsmith/commit/6edc9324ffc02aedcf768aeaf5268cbca458d7ee))
* **infra/staging:** Add INFLUXDB_BUCKET to task def ([#3199](https://github.com/Flagsmith/flagsmith/issues/3199)) ([445dc2b](https://github.com/Flagsmith/flagsmith/commit/445dc2b852617953fefd7dd6b40c5f1eee480450))
* OR button hiding and empty condtions ([#3269](https://github.com/Flagsmith/flagsmith/issues/3269)) ([0e28b6c](https://github.com/Flagsmith/flagsmith/commit/0e28b6cc98f5a4c03c95d662058cef896e1f8132))
* **versioning:** endpoints should return latest versions ([#3209](https://github.com/Flagsmith/flagsmith/issues/3209)) ([5e16e56](https://github.com/Flagsmith/flagsmith/commit/5e16e56c34e66787dc8d25512e58d1dbe869a4c4))
* **webhooks:** default task processor to use processor and prevent webhook retries in non-processor environments ([#3273](https://github.com/Flagsmith/flagsmith/issues/3273)) ([4d002fc](https://github.com/Flagsmith/flagsmith/commit/4d002fc84f563b559fceb67c2d03ace822d18499))

## [2.92.0](https://github.com/Flagsmith/flagsmith/compare/v2.91.0...v2.92.0) (2024-01-02)


### Features

* Add new url for role master api keys ([#3215](https://github.com/Flagsmith/flagsmith/issues/3215)) ([924149c](https://github.com/Flagsmith/flagsmith/commit/924149cdb711c510d2eb94c3d03f492977fac335))
* prepopulate control value on segment overrides ([#3208](https://github.com/Flagsmith/flagsmith/issues/3208)) ([68a1c6c](https://github.com/Flagsmith/flagsmith/commit/68a1c6c27eac83b90a9161864b47a9c19d6115f8))
* **tasks-processor:** Add recurring task to clean up old recurring task runs ([#3151](https://github.com/Flagsmith/flagsmith/issues/3151)) ([9f83f27](https://github.com/Flagsmith/flagsmith/commit/9f83f27481d31147173f772728c3e31116ba4548))


### Bug Fixes

* `env` variable instructions on locally-api.md ([#3223](https://github.com/Flagsmith/flagsmith/issues/3223)) ([4f2fa90](https://github.com/Flagsmith/flagsmith/commit/4f2fa90da424f326d2b8e3758c41439554cc829f))
* erroneous booleans in feature tooltip ([#3219](https://github.com/Flagsmith/flagsmith/issues/3219)) ([3758d33](https://github.com/Flagsmith/flagsmith/commit/3758d335a4c959e7da4f2caa0545711f90535969))

## [2.91.0](https://github.com/Flagsmith/flagsmith/compare/v2.90.0...v2.91.0) (2023-12-21)


### Features

* Add new url for roles master api keys ([#3154](https://github.com/Flagsmith/flagsmith/issues/3154)) ([d770399](https://github.com/Flagsmith/flagsmith/commit/d7703994f700f078f1a569be1f0fb64923b19193))
* add new url from role groups ([#3178](https://github.com/Flagsmith/flagsmith/issues/3178)) ([eebc541](https://github.com/Flagsmith/flagsmith/commit/eebc541e89daedfba4c98716d88c3ff5d4943032))
* Revert Add new url for roles master api keys ([#3154](https://github.com/Flagsmith/flagsmith/issues/3154)) ([#3214](https://github.com/Flagsmith/flagsmith/issues/3214)) ([22b8d9c](https://github.com/Flagsmith/flagsmith/commit/22b8d9cc2b8e51f622ea18520987351b2dda27a1))


### Bug Fixes

* **admin/task-processor:** handle no task run ([#3196](https://github.com/Flagsmith/flagsmith/issues/3196)) ([eab1f6d](https://github.com/Flagsmith/flagsmith/commit/eab1f6db74a9b0ba728e081bcc6ce83001553b15))
* **subscriptions:** ensure that manually added subscriptions work correctly in all deployments ([#3182](https://github.com/Flagsmith/flagsmith/issues/3182)) ([ae94267](https://github.com/Flagsmith/flagsmith/commit/ae94267bd11b346baa1466bf3d3c2ce38b2935dc))
* **task-processor:** implement grace period for deleting old recurring task ([#3169](https://github.com/Flagsmith/flagsmith/issues/3169)) ([00f0552](https://github.com/Flagsmith/flagsmith/commit/00f055297b55f3dfdceb8bd35ec22e1d50bfadfd))

## [2.90.0](https://github.com/Flagsmith/flagsmith/compare/v2.89.0...v2.90.0) (2023-12-20)


### Features

* **task-processor:** Add recurring task to clean password reset ([#3153](https://github.com/Flagsmith/flagsmith/issues/3153)) ([6898253](https://github.com/Flagsmith/flagsmith/commit/6898253d10e2347b9a309e81e0766761ce560e83))


### Bug Fixes

* **sse/tracking:** Use INFLUXDB_BUCKET for storing data ([#3197](https://github.com/Flagsmith/flagsmith/issues/3197)) ([fbd14fe](https://github.com/Flagsmith/flagsmith/commit/fbd14feed3aa2e3ffc861ce304e973f06614f91a))
* **task-processor/task-definition:** set RUN_BY_PROCESSOR ([#3195](https://github.com/Flagsmith/flagsmith/issues/3195)) ([f478def](https://github.com/Flagsmith/flagsmith/commit/f478def5af554752c0824d3fb7110d0052ad7406))
* **ui:** SAML should not be in Scale-up ([#3189](https://github.com/Flagsmith/flagsmith/issues/3189)) ([e6822bd](https://github.com/Flagsmith/flagsmith/commit/e6822bda01443c7fc05b5070ea90f490f0b4f6be))

## [2.89.0](https://github.com/Flagsmith/flagsmith/compare/v2.88.0...v2.89.0) (2023-12-19)


### Features

* Count v2 identity overrides for feature state list view ([#3164](https://github.com/Flagsmith/flagsmith/issues/3164)) ([65be52b](https://github.com/Flagsmith/flagsmith/commit/65be52b72835ba36075b499fdac59a1ace61b6ec))
* Create flagsmith on flagsmith feature export task ([#3149](https://github.com/Flagsmith/flagsmith/issues/3149)) ([e74ba0f](https://github.com/Flagsmith/flagsmith/commit/e74ba0f13ec17a3c949a9b3d1f68c2e15419d04e))
* Organisation reverts to free plan ([#3096](https://github.com/Flagsmith/flagsmith/issues/3096)) ([e5efdc8](https://github.com/Flagsmith/flagsmith/commit/e5efdc861cb6f88ac60dc503a596683f8a5ec0f1))
* **postgres/analytics:** Add task to clean-up old data ([#3170](https://github.com/Flagsmith/flagsmith/issues/3170)) ([8c8ce1f](https://github.com/Flagsmith/flagsmith/commit/8c8ce1f60478de197b95fc148abcaed680f2c5e5))
* Write migrated environments to v2 ([#3147](https://github.com/Flagsmith/flagsmith/issues/3147)) ([5914860](https://github.com/Flagsmith/flagsmith/commit/59148603b1566ef630d0b78118a540a210fb1624))


### Bug Fixes

* Add missing f-string from app_analytics models ([#3155](https://github.com/Flagsmith/flagsmith/issues/3155)) ([58d6589](https://github.com/Flagsmith/flagsmith/commit/58d6589889647a71fe22dacc4d960225996eee20))
* change request rendering issue when author no longer belongs to organisation ([#3087](https://github.com/Flagsmith/flagsmith/issues/3087)) ([8087fe2](https://github.com/Flagsmith/flagsmith/commit/8087fe2b65cd2ec2c945ea6d7d88332645f335ee))
* **Dockerfile:** setup gnupg correctly for nobody ([#3167](https://github.com/Flagsmith/flagsmith/issues/3167)) ([4759876](https://github.com/Flagsmith/flagsmith/commit/47598768d672dd1623abb822753317ddcc6c570c))
* Fine tune feature import export ([#3163](https://github.com/Flagsmith/flagsmith/issues/3163)) ([79e67ee](https://github.com/Flagsmith/flagsmith/commit/79e67ee40b06071093c580ab96649e2d5873407f))
* hide identity overrides badge or edge projects ([#3156](https://github.com/Flagsmith/flagsmith/issues/3156)) ([6a44b3d](https://github.com/Flagsmith/flagsmith/commit/6a44b3dd90cc9ff549dd99752618decd8d3cac9c))

## [2.88.0](https://github.com/Flagsmith/flagsmith/compare/v2.87.0...v2.88.0) (2023-12-13)


### Features

* Add a task for writing (edge) identity overrides ([#3127](https://github.com/Flagsmith/flagsmith/issues/3127)) ([2a9cd7c](https://github.com/Flagsmith/flagsmith/commit/2a9cd7cace471c2876f455436a9c5b0dd5cb4d45))
* add attribute to store identity overrides storage type ([#3109](https://github.com/Flagsmith/flagsmith/issues/3109)) ([c31322b](https://github.com/Flagsmith/flagsmith/commit/c31322bd4ed661d8ef23130cdcc0f4ad57a94153))
* Add dunning banner ([#3114](https://github.com/Flagsmith/flagsmith/issues/3114)) ([ad26100](https://github.com/Flagsmith/flagsmith/commit/ad261009de88ad12f831173dd192557278b4a7a9))
* add endpoint to list (edge) identity overrides for a feature ([#3116](https://github.com/Flagsmith/flagsmith/issues/3116)) ([098ab94](https://github.com/Flagsmith/flagsmith/commit/098ab94b17b5e7787252ec557dd3727e5bdd4342))
* Add new url for role users ([#3120](https://github.com/Flagsmith/flagsmith/issues/3120)) ([0604ec1](https://github.com/Flagsmith/flagsmith/commit/0604ec1467295887f608af379f081e4bf7ce04fc))
* Add Payment component in the blocked page ([#3068](https://github.com/Flagsmith/flagsmith/issues/3068)) ([3f100d2](https://github.com/Flagsmith/flagsmith/commit/3f100d20bee2d35342c9f8bc4294d0f68b84b3c9))
* explicitly set audit log created date ([#3083](https://github.com/Flagsmith/flagsmith/issues/3083)) ([e470ddb](https://github.com/Flagsmith/flagsmith/commit/e470ddb2f2fb7f4bf0fe4fe2afbe4744afff5ee3))
* Flag group owners ([#3112](https://github.com/Flagsmith/flagsmith/issues/3112)) ([b0a00d0](https://github.com/Flagsmith/flagsmith/commit/b0a00d0175460828038cb68656ea70d2a5fb3f0e))
* Import / export of features across environments and orgs ([#3026](https://github.com/Flagsmith/flagsmith/issues/3026)) ([c4bdc0f](https://github.com/Flagsmith/flagsmith/commit/c4bdc0fee57d2bb833e3b0f46dfb4b33f2c4acf8))
* Migrate given project's (edge) identities to environments v2 ([#3138](https://github.com/Flagsmith/flagsmith/issues/3138)) ([574a08e](https://github.com/Flagsmith/flagsmith/commit/574a08e274b1ee8de56faa765b3bb9a4ec464473))
* Set feature export response on initial API request ([#3126](https://github.com/Flagsmith/flagsmith/issues/3126)) ([89b7c8c](https://github.com/Flagsmith/flagsmith/commit/89b7c8c152a0e60c0816b56edc9339de645175f3))
* **sse:** track usage  ([#3050](https://github.com/Flagsmith/flagsmith/issues/3050)) ([9502e55](https://github.com/Flagsmith/flagsmith/commit/9502e55ea9c9fc67bfb4255e8485bff1ac018d2a))


### Bug Fixes

* **api-deploy/action.yml:** Write the PGP key correctly  ([#3099](https://github.com/Flagsmith/flagsmith/issues/3099)) ([c1c45cb](https://github.com/Flagsmith/flagsmith/commit/c1c45cbe1a8acc6feaa5182cc0f908626e0e51e6))
* bump rbac to fix import issue ([#3128](https://github.com/Flagsmith/flagsmith/issues/3128)) ([ba33582](https://github.com/Flagsmith/flagsmith/commit/ba33582863fe4d2e7cbe320ff8bd92a68ae6e8e5))
* do not show identity overrides tab until release ([#3134](https://github.com/Flagsmith/flagsmith/issues/3134)) ([b1fb768](https://github.com/Flagsmith/flagsmith/commit/b1fb768b29b7b9e9ef8dffa12e1a29613b08fc5c))
* **Dockerfile:** Use correct secret ID for pgp_key ([#3141](https://github.com/Flagsmith/flagsmith/issues/3141)) ([44ee410](https://github.com/Flagsmith/flagsmith/commit/44ee410b56ee3250bee27878bf3b4e79a885569a))
* Environments metadata n+1 for project admin ([#3101](https://github.com/Flagsmith/flagsmith/issues/3101)) ([093fa3a](https://github.com/Flagsmith/flagsmith/commit/093fa3a42f0f2c0d8e00c8a7ac9e4ef306f93831))
* hide additional actions on identity overrides tab in Edge ([#3135](https://github.com/Flagsmith/flagsmith/issues/3135)) ([5e0093e](https://github.com/Flagsmith/flagsmith/commit/5e0093ebebc9b4e2e3521353508dbe109c5087ec))
* Husky install ([#3137](https://github.com/Flagsmith/flagsmith/issues/3137)) ([921b210](https://github.com/Flagsmith/flagsmith/commit/921b2100b92581bf98cb1a28757fdac34a1f537b))
* Manage members layout is broken ([#3058](https://github.com/Flagsmith/flagsmith/issues/3058)) ([d129397](https://github.com/Flagsmith/flagsmith/commit/d129397a8ff91bcde022c3516582318bd2be6b94))
* re-add identity overrides for core projects ([#3139](https://github.com/Flagsmith/flagsmith/issues/3139)) ([8a5c20f](https://github.com/Flagsmith/flagsmith/commit/8a5c20f71038614e16e6b2e29c08931d82bf4c92))
* show falsy values in identity overrides ([#3144](https://github.com/Flagsmith/flagsmith/issues/3144)) ([68cfd15](https://github.com/Flagsmith/flagsmith/commit/68cfd156211e30e82aa16fb31cfc9864510037b6))
* Show scheduled change request ([#3118](https://github.com/Flagsmith/flagsmith/issues/3118)) ([efddf13](https://github.com/Flagsmith/flagsmith/commit/efddf13b5ed66818979eea60d63c3bcba64f7f94))
* **sse_recurring_task:** reload sse/tasks ([#3108](https://github.com/Flagsmith/flagsmith/issues/3108)) ([4e8e321](https://github.com/Flagsmith/flagsmith/commit/4e8e32156f527af72f4a9f806ca3b72a994e9dbf))
* **tests/NoCredentialsError:** use aws_credentials fixture ([#3131](https://github.com/Flagsmith/flagsmith/issues/3131)) ([7883e28](https://github.com/Flagsmith/flagsmith/commit/7883e283d403f8a518ac592e60642322968cb251))
* Unable to delete multiple segment overrides at once ([#3100](https://github.com/Flagsmith/flagsmith/issues/3100)) ([9e6e0ca](https://github.com/Flagsmith/flagsmith/commit/9e6e0ca91f750350b3dda4c98ac644436de9c51a))

## [2.87.0](https://github.com/Flagsmith/flagsmith/compare/v2.86.0...v2.87.0) (2023-12-05)


### Features

* add new endpoint to list summary objects of permission groups ([#3064](https://github.com/Flagsmith/flagsmith/issues/3064)) ([2880ef5](https://github.com/Flagsmith/flagsmith/commit/2880ef55cdf7eadfc50ef71217f57d20d7e83fff))


### Bug Fixes

* Add group owners to missing endpoint ([#3080](https://github.com/Flagsmith/flagsmith/issues/3080)) ([8fe2ea7](https://github.com/Flagsmith/flagsmith/commit/8fe2ea7a1ca9c069a0608c91d73660920414af22))
* Move environments and features to test area ([#3081](https://github.com/Flagsmith/flagsmith/issues/3081)) ([05a3b37](https://github.com/Flagsmith/flagsmith/commit/05a3b37319cbad8ba0ccae38c76b9db4e503b966))
* **postgres/feature-analytics:** use feature filter ([#3091](https://github.com/Flagsmith/flagsmith/issues/3091)) ([c0fc231](https://github.com/Flagsmith/flagsmith/commit/c0fc231a2c4d2c1b41e07aebd5721bd8a477a691))
* Reading role permissions generates 500 error backend ([#3079](https://github.com/Flagsmith/flagsmith/issues/3079)) ([cee607a](https://github.com/Flagsmith/flagsmith/commit/cee607a7ef19c0d0eed91ecf01ee44476214f440))
* Refactor existing Chargebee webhooks for subscriptions ([#3047](https://github.com/Flagsmith/flagsmith/issues/3047)) ([c89c56a](https://github.com/Flagsmith/flagsmith/commit/c89c56aaa694976e80e7b47d90b28921b0fdfece))
* remove pagination from group summaries ([#3090](https://github.com/Flagsmith/flagsmith/issues/3090)) ([1065ad0](https://github.com/Flagsmith/flagsmith/commit/1065ad0258c36e76cca6a106d4888ffdc329d54e))
* resolve outstanding N+1 issues ([#3066](https://github.com/Flagsmith/flagsmith/issues/3066)) ([661c42f](https://github.com/Flagsmith/flagsmith/commit/661c42f52c2c525d57a2c52954440b5444fd7fbf))
* revert "fix: Reading role permissions generates 500 error backend" ([#3093](https://github.com/Flagsmith/flagsmith/issues/3093)) ([e57a01c](https://github.com/Flagsmith/flagsmith/commit/e57a01cf54ce07a18b757b4c5e9707c247c89639))

## [2.86.0](https://github.com/Flagsmith/flagsmith/compare/v2.85.0...v2.86.0) (2023-11-30)


### Features

* **auth:** integrate ldap ([#3031](https://github.com/Flagsmith/flagsmith/issues/3031)) ([65f78f7](https://github.com/Flagsmith/flagsmith/commit/65f78f79c78fb272de1052ff1a2e6c830af50318))


### Bug Fixes

* only run index queries for Postgres DBs ([#3055](https://github.com/Flagsmith/flagsmith/issues/3055)) ([7664ea2](https://github.com/Flagsmith/flagsmith/commit/7664ea2073fcaed35f13a7ce6f4234d7b52fef2a))

## [2.85.0](https://github.com/Flagsmith/flagsmith/compare/v2.84.2...v2.85.0) (2023-11-28)


### Features

* Rebuild chargebee caches ([#3028](https://github.com/Flagsmith/flagsmith/issues/3028)) ([aed15c3](https://github.com/Flagsmith/flagsmith/commit/aed15c351d19813667de04245e9cb41560c15651))


### Bug Fixes

* Move projects and integrations to tests ([#3044](https://github.com/Flagsmith/flagsmith/issues/3044)) ([0dc4e14](https://github.com/Flagsmith/flagsmith/commit/0dc4e14aa10fa4f0401c2cac200e91a390700e28))
* Rely on Flagsmith Engine for segment evaluation, avoid N+1 queries ([#3038](https://github.com/Flagsmith/flagsmith/issues/3038)) ([616c6be](https://github.com/Flagsmith/flagsmith/commit/616c6be03a0b8c9dd742415c2fd2cde8cd08c95d))
* Safely parse announcement Flag ([#3052](https://github.com/Flagsmith/flagsmith/issues/3052)) ([6994f6b](https://github.com/Flagsmith/flagsmith/commit/6994f6bfb08eed104133fc13967ef68cac19b58b))

## [2.84.2](https://github.com/Flagsmith/flagsmith/compare/v2.84.1...v2.84.2) (2023-11-27)


### Bug Fixes

* Move organisation tests to proper location ([#3041](https://github.com/Flagsmith/flagsmith/issues/3041)) ([34c6d07](https://github.com/Flagsmith/flagsmith/commit/34c6d072adae2558c7fee4c58a61570a817fe23d))
* resolve environment N+1 caused by feature versioning v2 ([#3040](https://github.com/Flagsmith/flagsmith/issues/3040)) ([5392480](https://github.com/Flagsmith/flagsmith/commit/5392480c3e35fd689347a80714901d4f70116367))

## [2.84.1](https://github.com/Flagsmith/flagsmith/compare/v2.84.0...v2.84.1) (2023-11-27)


### Bug Fixes

* Revert to Core API segment evaluation ([#3036](https://github.com/Flagsmith/flagsmith/issues/3036)) ([e5058ae](https://github.com/Flagsmith/flagsmith/commit/e5058ae01cca1ceb783c38d2eb29c83f07a86a8c))

## [2.84.0](https://github.com/Flagsmith/flagsmith/compare/v2.83.0...v2.84.0) (2023-11-27)


### Features

* Feature Versioning V2 ([#2382](https://github.com/Flagsmith/flagsmith/issues/2382)) ([bcfb10e](https://github.com/Flagsmith/flagsmith/commit/bcfb10ece60d4c9ce751ceef8681a1d264d69291))
* Rely on Flagsmith Engine for segment evaluation ([#2865](https://github.com/Flagsmith/flagsmith/issues/2865)) ([322eb08](https://github.com/Flagsmith/flagsmith/commit/322eb08167a8cec4b052dabddd34b10e346dca9a))
* **ui:** hide API keys from integrations list ([#3019](https://github.com/Flagsmith/flagsmith/issues/3019)) ([b02a524](https://github.com/Flagsmith/flagsmith/commit/b02a524ad5932e1cb0ef447e3bb8aa754e966118))


### Bug Fixes

* WIP Move groups of tests to proper location ([#3027](https://github.com/Flagsmith/flagsmith/issues/3027)) ([1592919](https://github.com/Flagsmith/flagsmith/commit/159291919541b2c20e8302339b6a2e04722ce191))

## [2.83.0](https://github.com/Flagsmith/flagsmith/compare/v2.82.0...v2.83.0) (2023-11-21)


### Features

* introduce dunning billing status ([#2976](https://github.com/Flagsmith/flagsmith/issues/2976)) ([975c7b0](https://github.com/Flagsmith/flagsmith/commit/975c7b0d6438cd973ccd62b590436e4c2568b9d4))


### Bug Fixes

* **api:** validate before creating projects based on current subscription ([#2869](https://github.com/Flagsmith/flagsmith/issues/2869)) ([f32159e](https://github.com/Flagsmith/flagsmith/commit/f32159e3fd821c6dc7bfbd50a0c3d22374f1b558))
* **edge-identity-view:** reduce max page size to 100 ([#2937](https://github.com/Flagsmith/flagsmith/issues/2937)) ([6c4807f](https://github.com/Flagsmith/flagsmith/commit/6c4807f0b2dd2ee770d2d712b2955a9fd71c37a0))
* Move and merge features tests into proper location ([#3002](https://github.com/Flagsmith/flagsmith/issues/3002)) ([5f3482c](https://github.com/Flagsmith/flagsmith/commit/5f3482c8c376c6dd283ab4aff36dedb67825facc))

## [2.82.0](https://github.com/Flagsmith/flagsmith/compare/v2.81.1...v2.82.0) (2023-11-20)


### Features

* Add permission for manage segments overrides ([#2919](https://github.com/Flagsmith/flagsmith/issues/2919)) ([716f6a9](https://github.com/Flagsmith/flagsmith/commit/716f6a960a8843503e6af622eaea30a3924e9eb3))
* Add seats to next invoice ([#2977](https://github.com/Flagsmith/flagsmith/issues/2977)) ([e4325a8](https://github.com/Flagsmith/flagsmith/commit/e4325a872265d0c60415bac6545c8d040d31d00f))
* Remove all but first admin when subscription has reached cancellation date ([#2965](https://github.com/Flagsmith/flagsmith/issues/2965)) ([6976f81](https://github.com/Flagsmith/flagsmith/commit/6976f81c910d5d8de4f194fc27e799b72778b9f6))


### Bug Fixes

* add LDAP to installed apps ([#2993](https://github.com/Flagsmith/flagsmith/issues/2993)) ([9f9237e](https://github.com/Flagsmith/flagsmith/commit/9f9237ec8d9e017401316ded027989139e707bf2))
* ensure SimpleFeatureStateViewSet uses correct permissions for segment overrides ([#2990](https://github.com/Flagsmith/flagsmith/issues/2990)) ([00c6444](https://github.com/Flagsmith/flagsmith/commit/00c6444cc4abffb6bdd50e47f5f1e560667f8b85))
* Excessive 404s on subscription metadata ([#2985](https://github.com/Flagsmith/flagsmith/issues/2985)) ([627a6fa](https://github.com/Flagsmith/flagsmith/commit/627a6fa0b3d3609ac6e12aae7f9b71220f2567af))
* Failure to import LD project other than `default` ([#2979](https://github.com/Flagsmith/flagsmith/issues/2979)) ([e0d6e8a](https://github.com/Flagsmith/flagsmith/commit/e0d6e8acd9ef28d685fca724cef435bbefdbee3d))
* Logic in segment overrides readonly with the manage_segment_overrides permission ([#2973](https://github.com/Flagsmith/flagsmith/issues/2973)) ([37879b2](https://github.com/Flagsmith/flagsmith/commit/37879b2046cd7bcd1293ffa81c2bfcaff93798d3))
* Move tests to unit  ([#2987](https://github.com/Flagsmith/flagsmith/issues/2987)) ([43caad8](https://github.com/Flagsmith/flagsmith/commit/43caad803b4d04144099e9cdfb4554a1ef19cb14))
* opening the flag panel shifts the main table slightly ([#2994](https://github.com/Flagsmith/flagsmith/issues/2994)) ([85d980c](https://github.com/Flagsmith/flagsmith/commit/85d980c6cb817867848f4676744e4324df8f3f49))
* Pagination icons disappeared ([#2982](https://github.com/Flagsmith/flagsmith/issues/2982)) ([0d2b979](https://github.com/Flagsmith/flagsmith/commit/0d2b979354390e945bcd003e174c424ac7482f2e))
* Update docstring to not include change requests ([#2995](https://github.com/Flagsmith/flagsmith/issues/2995)) ([e3ac7ef](https://github.com/Flagsmith/flagsmith/commit/e3ac7ef063d81f4264b3a03552dd67925e31382b))
* Update endpoint getEnvironment RTK response ([#2968](https://github.com/Flagsmith/flagsmith/issues/2968)) ([3993823](https://github.com/Flagsmith/flagsmith/commit/39938239a6f58a0266c9a32f35ee6c5ae7c15c5c))

## [2.81.1](https://github.com/Flagsmith/flagsmith/compare/v2.81.0...v2.81.1) (2023-11-14)


### Bug Fixes

* try self-hosted runner for the private cloud image ([#2969](https://github.com/Flagsmith/flagsmith/issues/2969)) ([99180cd](https://github.com/Flagsmith/flagsmith/commit/99180cdbf3cc3362efbb80eb83d131d066ae0f5f))

## [2.81.0](https://github.com/Flagsmith/flagsmith/compare/v2.80.0...v2.81.0) (2023-11-14)


### Features

* add foundation for LDAP in core repository ([#2923](https://github.com/Flagsmith/flagsmith/issues/2923)) ([65351e2](https://github.com/Flagsmith/flagsmith/commit/65351e205e268e49b01567ab7ed06fbaa1107643))
* Add manage segment overrides permission in UI ([#2936](https://github.com/Flagsmith/flagsmith/issues/2936)) ([88c43cd](https://github.com/Flagsmith/flagsmith/commit/88c43cda72cb747735254de44ae0ed78bc954808))
* Allow organisation admins to mandate 2fa for their organisation ([#2877](https://github.com/Flagsmith/flagsmith/issues/2877)) ([1d006fb](https://github.com/Flagsmith/flagsmith/commit/1d006fbc1515e16582210554b562d4aec2b382d5))
* trial management in sales dashboard ([#2805](https://github.com/Flagsmith/flagsmith/issues/2805)) ([a056713](https://github.com/Flagsmith/flagsmith/commit/a056713c31b11302b9445a57929b6a4ee9e4d109))


### Bug Fixes

* Audit Log records don't get created with threaded task processing ([#2958](https://github.com/Flagsmith/flagsmith/issues/2958)) ([716b228](https://github.com/Flagsmith/flagsmith/commit/716b2281c1d15277cfd9f48843970fc3c785719d))
* Fix evironment metadata N+1 for environments list ([#2947](https://github.com/Flagsmith/flagsmith/issues/2947)) ([7e1c779](https://github.com/Flagsmith/flagsmith/commit/7e1c77911af7c9cdbbdb6f9b1dff6c7c95becc52))
* Handle payment errors during user flow ([#2951](https://github.com/Flagsmith/flagsmith/issues/2951)) ([b18e4a6](https://github.com/Flagsmith/flagsmith/commit/b18e4a6d6588e80be4575de1891d51f10040ebef))
* Move organisation tests ([#2964](https://github.com/Flagsmith/flagsmith/issues/2964)) ([01d14d2](https://github.com/Flagsmith/flagsmith/commit/01d14d2ce23c787bbcea417fefb97b85a56b6413))
* sales dashboard subscription metadata shows wrong data after starting trial ([#2962](https://github.com/Flagsmith/flagsmith/issues/2962)) ([9a49f7d](https://github.com/Flagsmith/flagsmith/commit/9a49f7dcac5c01741cc5625314215edb04f1a3ea))

## [2.80.0](https://github.com/Flagsmith/flagsmith/compare/v2.79.0...v2.80.0) (2023-11-13)


### Features

* add copy button to server keys ([#2943](https://github.com/Flagsmith/flagsmith/issues/2943)) ([b78842b](https://github.com/Flagsmith/flagsmith/commit/b78842b6041cff8edc8c8091f79b47953568a63d))
* Add or remove user and groups from roles ([#2791](https://github.com/Flagsmith/flagsmith/issues/2791)) ([c2d0c11](https://github.com/Flagsmith/flagsmith/commit/c2d0c1142f5beb18c90c14e35c3eb329aafc26b4))
* **boto3/dynamo:** use tcp_keepalive ([#2926](https://github.com/Flagsmith/flagsmith/issues/2926)) ([eee1c0a](https://github.com/Flagsmith/flagsmith/commit/eee1c0a647331dd49ebd81fbc9cc0e1b53ce6c72))


### Bug Fixes

* Check that feature owners are able to view the project of a feature ([#2931](https://github.com/Flagsmith/flagsmith/issues/2931)) ([a0eefdd](https://github.com/Flagsmith/flagsmith/commit/a0eefdd3223cb0e684eb4aed36f21b9ea4f9d370))
* Close icon missing in roles modal ([#2946](https://github.com/Flagsmith/flagsmith/issues/2946)) ([4960f7e](https://github.com/Flagsmith/flagsmith/commit/4960f7e51f63b6483a5751dc435a67e20bcb6499))
* creating change requests in private cloud UI ([#2953](https://github.com/Flagsmith/flagsmith/issues/2953)) ([8eedf55](https://github.com/Flagsmith/flagsmith/commit/8eedf55ab34a9eedeea9c11e1dd9ac7b8e0ffa61))
* **deps:** CVE dependency updates (PVE-2023-61661, PVE-2023-61657, PV… ([#2939](https://github.com/Flagsmith/flagsmith/issues/2939)) ([ac26fc9](https://github.com/Flagsmith/flagsmith/commit/ac26fc97fb9aa461357973a25ab52741ccbfc7d9))
* Infinite loop 404 after leaving the organisation ([#2957](https://github.com/Flagsmith/flagsmith/issues/2957)) ([7b7f986](https://github.com/Flagsmith/flagsmith/commit/7b7f9860e63806552353f092d3d61a9d23f8c0af))
* prevent sentry errors for on premise subscriptions ([#2948](https://github.com/Flagsmith/flagsmith/issues/2948)) ([6f830e2](https://github.com/Flagsmith/flagsmith/commit/6f830e2b2124dd50d2cd078e156d028c5b9f9ae9))
* Rebuild environments when stop serving flags changed ([#2944](https://github.com/Flagsmith/flagsmith/issues/2944)) ([7d16197](https://github.com/Flagsmith/flagsmith/commit/7d161972e9a9e7ffbffbff905ae0053d86bd35f9))

## [2.79.0](https://github.com/Flagsmith/flagsmith/compare/v2.78.0...v2.79.0) (2023-11-07)


### Features

* add group owners to features ([#2908](https://github.com/Flagsmith/flagsmith/issues/2908)) ([493f0e5](https://github.com/Flagsmith/flagsmith/commit/493f0e5a09bb92dab38e13419e7b5c320e9779dd))
* Create staff fixture ([#2928](https://github.com/Flagsmith/flagsmith/issues/2928)) ([a09436d](https://github.com/Flagsmith/flagsmith/commit/a09436ddde7fd7c68a8e75b1dd311d5ac804f397))


### Bug Fixes

* Tighten ACL for user routes ([#2929](https://github.com/Flagsmith/flagsmith/issues/2929)) ([3732e67](https://github.com/Flagsmith/flagsmith/commit/3732e67f2dc1c0010ad5d4796960af2ddedf90c9))

## [2.78.0](https://github.com/Flagsmith/flagsmith/compare/v2.77.0...v2.78.0) (2023-11-01)


### Features

* **task-processor:** Add priority support  ([#2847](https://github.com/Flagsmith/flagsmith/issues/2847)) ([6830ef6](https://github.com/Flagsmith/flagsmith/commit/6830ef666c7f9931a4d4edfeef9e58e7d2768dcc))


### Bug Fixes

* Revert "ci: Run only API tests affected by changes in PRs and Upgrade GHA runners" ([#2910](https://github.com/Flagsmith/flagsmith/issues/2910)) ([6a730c7](https://github.com/Flagsmith/flagsmith/commit/6a730c7ae87b06df13af82b4c51dd113343c6333))
* **task/priority:** change field to SmallIntegerField ([#2914](https://github.com/Flagsmith/flagsmith/issues/2914)) ([6e6a48b](https://github.com/Flagsmith/flagsmith/commit/6e6a48be303197ebc90d096b44c4b75d7a22c778))

## [2.77.0](https://github.com/Flagsmith/flagsmith/compare/v2.76.0...v2.77.0) (2023-10-30)


### Features

* Click Segment Overrides icon doesnt open the segment override tab ([#2887](https://github.com/Flagsmith/flagsmith/issues/2887)) ([96f3b22](https://github.com/Flagsmith/flagsmith/commit/96f3b22f3d21d81074643df90878dba2ace51580))
* **permissions/tags:** Add tags support  ([#2685](https://github.com/Flagsmith/flagsmith/issues/2685)) ([78e559c](https://github.com/Flagsmith/flagsmith/commit/78e559c320011bcc6ec9339cb2614a9751244156))


### Bug Fixes

* Handle null tooltip data ([#2892](https://github.com/Flagsmith/flagsmith/issues/2892)) ([a1190ae](https://github.com/Flagsmith/flagsmith/commit/a1190ae90a31496e9e368a1dbdc232a1dd4daf1a))

## [2.76.0](https://github.com/Flagsmith/flagsmith/compare/v2.75.0...v2.76.0) (2023-10-24)


### Features

* **rate-limit:** allow user to pass default throttle classes ([#2878](https://github.com/Flagsmith/flagsmith/issues/2878)) ([dc4b02c](https://github.com/Flagsmith/flagsmith/commit/dc4b02c7c3a67c34f16146c686786ffb09367ecf))

## [2.75.0](https://github.com/Flagsmith/flagsmith/compare/v2.74.0...v2.75.0) (2023-10-23)


### Features

* partial imports, off values as control value ([#2864](https://github.com/Flagsmith/flagsmith/issues/2864)) ([93df958](https://github.com/Flagsmith/flagsmith/commit/93df958b8fc67d17c6cfc298184bfef0f83847b4))
* update change request layout ([#2848](https://github.com/Flagsmith/flagsmith/issues/2848)) ([eaffffe](https://github.com/Flagsmith/flagsmith/commit/eaffffe0d0313eaadbf25980ea42afeb1e753ffd))


### Bug Fixes

* Cannot see the assigned users in the changes request section ([#2868](https://github.com/Flagsmith/flagsmith/issues/2868)) ([59abf20](https://github.com/Flagsmith/flagsmith/commit/59abf20f59b92c5f47d7ddfc698c81eb695e3bb4))
* rate limit admin endpoints ([#2703](https://github.com/Flagsmith/flagsmith/issues/2703)) ([b0ef013](https://github.com/Flagsmith/flagsmith/commit/b0ef0134cf40703de225ffa3ad4363fee4f8f997))

## [2.74.0](https://github.com/Flagsmith/flagsmith/compare/v2.73.1...v2.74.0) (2023-10-18)


### Features

* Launchdarkly importer ([#2530](https://github.com/Flagsmith/flagsmith/issues/2530)) ([4f7464b](https://github.com/Flagsmith/flagsmith/commit/4f7464b24aba4f0cf0fb79379dbde1275f50f71a))
* LaunchDarkly importer UI ([#2837](https://github.com/Flagsmith/flagsmith/issues/2837)) ([a78eeaf](https://github.com/Flagsmith/flagsmith/commit/a78eeaf4cae8b84ef3b45f5edd761dc46da966ba))


### Bug Fixes

* enable audit for import events ([#2849](https://github.com/Flagsmith/flagsmith/issues/2849)) ([7964e49](https://github.com/Flagsmith/flagsmith/commit/7964e4999cbea031422aa610282cbacc303d8177))
* incorrect default_percentage_allocation on import, binary flags imported as multivariate ([#2841](https://github.com/Flagsmith/flagsmith/issues/2841)) ([619c3f5](https://github.com/Flagsmith/flagsmith/commit/619c3f52a821d8eaace2035c5e34b51b16040deb))
* Logged out of Flagsmith when testing Webhook ([#2842](https://github.com/Flagsmith/flagsmith/issues/2842)) ([cfbf7f1](https://github.com/Flagsmith/flagsmith/commit/cfbf7f192e699c9318c97a05266e31ff7d680e3d))

## [2.73.1](https://github.com/Flagsmith/flagsmith/compare/v2.73.0...v2.73.1) (2023-10-05)


### Bug Fixes

* **tasks:** Create a different task to update environment document  ([#2807](https://github.com/Flagsmith/flagsmith/issues/2807)) ([ab21983](https://github.com/Flagsmith/flagsmith/commit/ab21983e8736d4244df2cd37c235d8ce4795e948))

## [2.73.0](https://github.com/Flagsmith/flagsmith/compare/v2.72.1...v2.73.0) (2023-10-05)


### Features

* **tasks/queue-size:** Implement queue_size ([#2826](https://github.com/Flagsmith/flagsmith/issues/2826)) ([94fff2c](https://github.com/Flagsmith/flagsmith/commit/94fff2c53bc80ada60c18bf5bfd91c700d363d61))


### Bug Fixes

* Project Dropdown selector is not sorted alphabetically ([#2812](https://github.com/Flagsmith/flagsmith/issues/2812)) ([7123cf6](https://github.com/Flagsmith/flagsmith/commit/7123cf67df7169576eaeb609f1d67b48097310bf))
* Shows "Identities" nav element as disabled for users without relevant permission ([#2813](https://github.com/Flagsmith/flagsmith/issues/2813)) ([3ec2f6b](https://github.com/Flagsmith/flagsmith/commit/3ec2f6b4d10019c757f336f23048342aab835d13))

## [2.72.1](https://github.com/Flagsmith/flagsmith/compare/v2.72.0...v2.72.1) (2023-09-28)


### Bug Fixes

* Last Influx data updated at never updates ([#2802](https://github.com/Flagsmith/flagsmith/issues/2802)) ([929afeb](https://github.com/Flagsmith/flagsmith/commit/929afeb49466bf0be893a2f5033c0fff8a6f8a1a))
* Payment modal ([#2792](https://github.com/Flagsmith/flagsmith/issues/2792)) ([c231749](https://github.com/Flagsmith/flagsmith/commit/c231749272d52d7b1a987aa2fdd82855e05f6d07))
* Price is missing in dark mode ([#2799](https://github.com/Flagsmith/flagsmith/issues/2799)) ([31c9884](https://github.com/Flagsmith/flagsmith/commit/31c9884b9cd3a518b14cf8b796c934c4303738a9))
* **seat-upgrades:** Allow auto seat upgrades for new scaleup plan ([#2809](https://github.com/Flagsmith/flagsmith/issues/2809)) ([1cada3c](https://github.com/Flagsmith/flagsmith/commit/1cada3ced81e9b9b4a4257a49ec0a9da9e305f1c))
* Toast messages look wrong ([#2800](https://github.com/Flagsmith/flagsmith/issues/2800)) ([f003732](https://github.com/Flagsmith/flagsmith/commit/f003732d89d4e2ad01a222083dcd68760faa6950))

## [2.72.0](https://github.com/Flagsmith/flagsmith/compare/v2.71.0...v2.72.0) (2023-09-19)


### Features

* Add a pill for server side only flags ([#2780](https://github.com/Flagsmith/flagsmith/issues/2780)) ([2b70c68](https://github.com/Flagsmith/flagsmith/commit/2b70c68d548a1f9a5ae30372506e503611d7c707))
* display warning and prevent creation on limit ([#2526](https://github.com/Flagsmith/flagsmith/issues/2526)) ([000be2b](https://github.com/Flagsmith/flagsmith/commit/000be2b0c071d6ef839da5d0febcc85b58e47ab7))
* Realtime updates, defaultFlags, cacheControl and timeout config for Android ([#2757](https://github.com/Flagsmith/flagsmith/issues/2757)) ([54de331](https://github.com/Flagsmith/flagsmith/commit/54de331af199a898e7850eeac30aeb9ac41a4d58))


### Bug Fixes

* Environment webhook update button not working ([#2788](https://github.com/Flagsmith/flagsmith/issues/2788)) ([5f92a00](https://github.com/Flagsmith/flagsmith/commit/5f92a0067034ae1ee95d3b3bb8c360eddd8996bb))
* Feature id in mv-option request is undefined ([#2751](https://github.com/Flagsmith/flagsmith/issues/2751)) ([3c3b1d7](https://github.com/Flagsmith/flagsmith/commit/3c3b1d7af2e4b62f75979b8c8c2ea931f8736cbd))
* fix segments display crashing ([#2770](https://github.com/Flagsmith/flagsmith/issues/2770)) ([#2789](https://github.com/Flagsmith/flagsmith/issues/2789)) ([bb080d2](https://github.com/Flagsmith/flagsmith/commit/bb080d2e11ecb6197406b483c58e694f66c95194))
* Send JSON response instead of plain text ([#2739](https://github.com/Flagsmith/flagsmith/issues/2739)) ([cad0cbf](https://github.com/Flagsmith/flagsmith/commit/cad0cbfb08fd34c2732ff5fefc2f5a5752cb60cf))

## [2.71.0](https://github.com/Flagsmith/flagsmith/compare/v2.70.2...v2.71.0) (2023-09-11)


### Features

* Add feature description like the old UI ([#2733](https://github.com/Flagsmith/flagsmith/issues/2733)) ([33e7c17](https://github.com/Flagsmith/flagsmith/commit/33e7c17b3f7b1cb7964c2f00ae8001faf251945e))
* **task-processor:** validate arguments passed to task processor functions ([#2747](https://github.com/Flagsmith/flagsmith/issues/2747)) ([d947474](https://github.com/Flagsmith/flagsmith/commit/d947474696a3a213ff196ffc5ac3bf802dbd8062))


### Bug Fixes

* allow registration via invite link if ALLOW_REGISTRATION_WITHOUT_INVITE is False ([#2731](https://github.com/Flagsmith/flagsmith/issues/2731)) ([73705d5](https://github.com/Flagsmith/flagsmith/commit/73705d57068ef63eb5c36b104dc25b68fa14dcfd))
* Deleting a project causes multiple UI issues ([#2749](https://github.com/Flagsmith/flagsmith/issues/2749)) ([8cd144b](https://github.com/Flagsmith/flagsmith/commit/8cd144b66069fbc0bdc934d67d44f9d4fd5d6d16))
* **featurestate-permissions:** Add misc extra checks ([#2712](https://github.com/Flagsmith/flagsmith/issues/2712)) ([ecb7fd2](https://github.com/Flagsmith/flagsmith/commit/ecb7fd2c0e352058609b07ac049d90ca9d2a36e5))
* UI issue when there were more than 100 features ([#2711](https://github.com/Flagsmith/flagsmith/issues/2711)) ([c1a62ce](https://github.com/Flagsmith/flagsmith/commit/c1a62ce47c57a30bdeeee2adb023e36bbf9ff579))
* update ecs staging docker ([#2759](https://github.com/Flagsmith/flagsmith/issues/2759)) ([34f9a5b](https://github.com/Flagsmith/flagsmith/commit/34f9a5b8b0b02dce76cf7d7488e76e2ce78ed279))
* Update Webhook button not working ([#2753](https://github.com/Flagsmith/flagsmith/issues/2753)) ([8566fe0](https://github.com/Flagsmith/flagsmith/commit/8566fe02c39a7ddd958f42ffcb59320948b72e38))
* Webhook doesnt show the environment selected ([#2748](https://github.com/Flagsmith/flagsmith/issues/2748)) ([79b6030](https://github.com/Flagsmith/flagsmith/commit/79b60307ea279a6a6ddc0324b9cf436e5a62ae23))

## [2.70.2](https://github.com/Flagsmith/flagsmith/compare/v2.70.1...v2.70.2) (2023-09-05)


### Bug Fixes

* **chargebee:** ensure multiple addons are counted to subscription limits ([#2741](https://github.com/Flagsmith/flagsmith/issues/2741)) ([2ac23a8](https://github.com/Flagsmith/flagsmith/commit/2ac23a8d4cc966dc66ab8d31da7c536aec355bd1))
* **migrations:** remove features/0060 set environment not null ([#2738](https://github.com/Flagsmith/flagsmith/issues/2738)) ([3aed121](https://github.com/Flagsmith/flagsmith/commit/3aed12170ce72bfd8ebca5a74153ca0b7dcec40c))

## [2.70.1](https://github.com/Flagsmith/flagsmith/compare/v2.70.0...v2.70.1) (2023-09-05)


### Bug Fixes

* remove migration health check ([#2736](https://github.com/Flagsmith/flagsmith/issues/2736)) ([e5483cb](https://github.com/Flagsmith/flagsmith/commit/e5483cbdcd6a79b278d41775e18a2722bd177a9d))

## [2.70.0](https://github.com/Flagsmith/flagsmith/compare/v2.69.1...v2.70.0) (2023-09-05)


### Features

* integrate flagsmith client into API layer ([#2447](https://github.com/Flagsmith/flagsmith/issues/2447)) ([e71efbb](https://github.com/Flagsmith/flagsmith/commit/e71efbb19d7e81b4601f5e50968a1ea362b6e32d))


### Bug Fixes

* **model/featurestate:** make environment not null ([#2708](https://github.com/Flagsmith/flagsmith/issues/2708)) ([55a9ef7](https://github.com/Flagsmith/flagsmith/commit/55a9ef7bcfc62b9752a7407fbfe545b2df6bb72c))

## [2.69.1](https://github.com/Flagsmith/flagsmith/compare/v2.69.0...v2.69.1) (2023-09-01)


### Bug Fixes

* Announcement desing ([#2721](https://github.com/Flagsmith/flagsmith/issues/2721)) ([45844d2](https://github.com/Flagsmith/flagsmith/commit/45844d2105534a6fe7819f4817de59816ca486dd))
* Button to go to the link doesnt close the announcement ([#2724](https://github.com/Flagsmith/flagsmith/issues/2724)) ([b7c92df](https://github.com/Flagsmith/flagsmith/commit/b7c92df09f02bdcbeab7a7b0b9c5f1491b1d5dff))
* make `OrganisationSubscriptionInformationCache.allowed_projects` nullable ([#2716](https://github.com/Flagsmith/flagsmith/issues/2716)) ([1b37c99](https://github.com/Flagsmith/flagsmith/commit/1b37c99d93471def56a5042afb78e15cc2d7727e))
* prevent error when addons is null ([#2722](https://github.com/Flagsmith/flagsmith/issues/2722)) ([003d782](https://github.com/Flagsmith/flagsmith/commit/003d7824acf5d3242d79664dde7ff51f9b2a1ac6))

## [2.69.0](https://github.com/Flagsmith/flagsmith/compare/v2.68.0...v2.69.0) (2023-08-31)


### Features

* Home page announcement ([#2710](https://github.com/Flagsmith/flagsmith/issues/2710)) ([9de235b](https://github.com/Flagsmith/flagsmith/commit/9de235b6cc68f6b467c7ccc7db3317b069c6dbd6))
* **master-api-key/roles:** Add roles to master api key ([#2436](https://github.com/Flagsmith/flagsmith/issues/2436)) ([a46295b](https://github.com/Flagsmith/flagsmith/commit/a46295b885ecaf2a40a2f626a46c3a46a323f833))
* Use get-metadata-subscription to get max_api_calls ([#2279](https://github.com/Flagsmith/flagsmith/issues/2279)) ([42049fc](https://github.com/Flagsmith/flagsmith/commit/42049fcca8372dc32b4dab0fb350b9d8dc15ab34))


### Bug Fixes

* ensure feature segments are cloned correctly ([#2706](https://github.com/Flagsmith/flagsmith/issues/2706)) ([414e62f](https://github.com/Flagsmith/flagsmith/commit/414e62f6821efb9bf85dfc72a1f76625c6e96b20))
* **env-clone/permission:** allow clone using CREATE_ENVIRONMENT ([#2675](https://github.com/Flagsmith/flagsmith/issues/2675)) ([edc3afc](https://github.com/Flagsmith/flagsmith/commit/edc3afcb84b624aedbc9af56861cc1eb0f60dcf3))
* environment document totals ([#2671](https://github.com/Flagsmith/flagsmith/issues/2671)) ([33c9bf2](https://github.com/Flagsmith/flagsmith/commit/33c9bf22dce4ff50e0e01a9c1351b31aee41411d))
* settings page margin ([#2707](https://github.com/Flagsmith/flagsmith/issues/2707)) ([ef0ca42](https://github.com/Flagsmith/flagsmith/commit/ef0ca42bad1c58d4ab7730bbf021c4ace3357315))

## [2.68.0](https://github.com/Flagsmith/flagsmith/compare/v2.67.0...v2.68.0) (2023-08-22)


### Features

* admin action to delete all segments for project ([#2646](https://github.com/Flagsmith/flagsmith/issues/2646)) ([4df1b80](https://github.com/Flagsmith/flagsmith/commit/4df1b8037796b1304ce2dc4353c51bc7a67b1178))
* re-add totals and limits ([#2631](https://github.com/Flagsmith/flagsmith/issues/2631)) ([7a6a2c8](https://github.com/Flagsmith/flagsmith/commit/7a6a2c8f929bc079526a852494e3cfb87f796fb3))


### Bug Fixes

* **frontend:** Disabled loading indicator when getting featuers so screen doesn't flicker ([#2598](https://github.com/Flagsmith/flagsmith/issues/2598)) ([830e899](https://github.com/Flagsmith/flagsmith/commit/830e8991e7526a0e05cbbcef22110189d4a8ba55))
* **password-reset:** rate limit password reset emails ([#2619](https://github.com/Flagsmith/flagsmith/issues/2619)) ([db98743](https://github.com/Flagsmith/flagsmith/commit/db98743d426c0ded932d5a624cf8bd00cf2c6a86))
* total api calls handling ([#2583](https://github.com/Flagsmith/flagsmith/issues/2583)) ([ff0da20](https://github.com/Flagsmith/flagsmith/commit/ff0da20c57c4d37829e6d32e60db35886529fc86))
* **user-create:** duplicate email error message ([#2642](https://github.com/Flagsmith/flagsmith/issues/2642)) ([7b65a8d](https://github.com/Flagsmith/flagsmith/commit/7b65a8d7d7b0a2d6b938170a67ba6cabc32d00df))

## [2.67.0](https://github.com/Flagsmith/flagsmith/compare/v2.66.2...v2.67.0) (2023-08-15)


### Features

* Compare identities ([#2616](https://github.com/Flagsmith/flagsmith/issues/2616)) ([aafce13](https://github.com/Flagsmith/flagsmith/commit/aafce134fd2d078fe244e6ed983e2f05cfff820b))


### Bug Fixes

* update POETRY_OPTS in private cloud build ([#2624](https://github.com/Flagsmith/flagsmith/issues/2624)) ([d76f84c](https://github.com/Flagsmith/flagsmith/commit/d76f84c202641011443831f5edd912bec01cd64f))

## [2.66.2](https://github.com/Flagsmith/flagsmith/compare/v2.66.1...v2.66.2) (2023-08-10)


### Bug Fixes

* revert totals attributes ([#2625](https://github.com/Flagsmith/flagsmith/issues/2625)) ([3905527](https://github.com/Flagsmith/flagsmith/commit/39055275d18023702b9906991ad418cb2857088f))

## [2.66.1](https://github.com/Flagsmith/flagsmith/compare/v2.66.0...v2.66.1) (2023-08-10)


### Bug Fixes

* issue retrieving project with master api key ([#2623](https://github.com/Flagsmith/flagsmith/issues/2623)) ([1514bf7](https://github.com/Flagsmith/flagsmith/commit/1514bf735d670de67b847873061797608387f039))
* update auth controller vars in private cloud image build ([#2620](https://github.com/Flagsmith/flagsmith/issues/2620)) ([863c863](https://github.com/Flagsmith/flagsmith/commit/863c863ef6b595c24f8cf1de95a851f9de6b2f0a))

## [2.66.0](https://github.com/Flagsmith/flagsmith/compare/v2.65.0...v2.66.0) (2023-08-10)


### Features

* add limits and totals to API responses ([#2615](https://github.com/Flagsmith/flagsmith/issues/2615)) ([321d435](https://github.com/Flagsmith/flagsmith/commit/321d43537a049bd8b8efecad1619e7b32aa0bf33))
* Migrate to poetry ([#2214](https://github.com/Flagsmith/flagsmith/issues/2214)) ([0754071](https://github.com/Flagsmith/flagsmith/commit/0754071edebaca400c0fb2db1169de0495a2c33b))


### Bug Fixes

* Associated segment overrides ([#2582](https://github.com/Flagsmith/flagsmith/issues/2582)) ([707d394](https://github.com/Flagsmith/flagsmith/commit/707d3949a93e2041b3b25ee71a3f1693a311772f))
* metadata validation causes AttributeError for patch requests ([#2614](https://github.com/Flagsmith/flagsmith/issues/2614)) ([5e13707](https://github.com/Flagsmith/flagsmith/commit/5e13707b911a53924496a2e57e72b436b4dec510))
* variation value overflow ([#2612](https://github.com/Flagsmith/flagsmith/issues/2612)) ([863161b](https://github.com/Flagsmith/flagsmith/commit/863161b60b31db9defb751da852d9835e20f6746))

## [2.65.0](https://github.com/Flagsmith/flagsmith/compare/v2.64.1...v2.65.0) (2023-08-04)


### Features

* Use isEnterprise from endpoint version response to determine permissions ([#2422](https://github.com/Flagsmith/flagsmith/issues/2422)) ([edf38ac](https://github.com/Flagsmith/flagsmith/commit/edf38ac8114a7148991ee47b216fa67a5ffd5e95))


### Bug Fixes

* ensure that migrate command exits with non zero error code ([#2578](https://github.com/Flagsmith/flagsmith/issues/2578)) ([6c96ccf](https://github.com/Flagsmith/flagsmith/commit/6c96ccfbb70e559b3b525e683563217f85fd406d))

## [2.64.1](https://github.com/Flagsmith/flagsmith/compare/v2.64.0...v2.64.1) (2023-08-03)


### Bug Fixes

* environment webhooks shows current date, not created date ([#2555](https://github.com/Flagsmith/flagsmith/issues/2555)) ([94fb957](https://github.com/Flagsmith/flagsmith/commit/94fb957e2beafaa2e303e63d0e9fc954e37daf85))
* Highlight encoding ([#2558](https://github.com/Flagsmith/flagsmith/issues/2558)) ([717f175](https://github.com/Flagsmith/flagsmith/commit/717f17579eb08d403439b51b932692eb8a118b90))
* Sanitize HTML tooltips ([#2538](https://github.com/Flagsmith/flagsmith/issues/2538)) ([f68ea54](https://github.com/Flagsmith/flagsmith/commit/f68ea5426a0fe704276725b29c5d1b4fad9aeb35))

## [2.64.0](https://github.com/Flagsmith/flagsmith/compare/v2.63.3...v2.64.0) (2023-07-31)


### Features

* **integrations:** add support for Amplitude base url ([#2534](https://github.com/Flagsmith/flagsmith/issues/2534)) ([5d52564](https://github.com/Flagsmith/flagsmith/commit/5d5256483dd99d05ceaf4cb08ea66191b1cbc852))

## [2.63.3](https://github.com/Flagsmith/flagsmith/compare/v2.63.2...v2.63.3) (2023-07-28)


### Bug Fixes

* allow creating integration configurations where deleted versions exist ([#2531](https://github.com/Flagsmith/flagsmith/issues/2531)) ([3430829](https://github.com/Flagsmith/flagsmith/commit/34308293a2b3a5dfa8f4b764e847e6cd297279ed))
* change request audit logs ([#2527](https://github.com/Flagsmith/flagsmith/issues/2527)) ([d7c459e](https://github.com/Flagsmith/flagsmith/commit/d7c459ed4f43b57d61259692a1efb5363a4f4d41))
* percentage allocation display ([#2518](https://github.com/Flagsmith/flagsmith/issues/2518)) ([f8b1d50](https://github.com/Flagsmith/flagsmith/commit/f8b1d50a62ec08bb1df8b00b9ba1edcc1b91aeb5))
* **roles/org-permission:** Add missing viewset ([#2495](https://github.com/Flagsmith/flagsmith/issues/2495)) ([2b56c7c](https://github.com/Flagsmith/flagsmith/commit/2b56c7cc52631686f8b28e9cdb03c7203ec6abdb))
* **SwaggerGenerationError:** Remove filterset_field ([#2539](https://github.com/Flagsmith/flagsmith/issues/2539)) ([6dba7bd](https://github.com/Flagsmith/flagsmith/commit/6dba7bdd0563a4916d9185555512d21e6d77643c))
* **tests:** support any webhook order ([#2524](https://github.com/Flagsmith/flagsmith/issues/2524)) ([da2b4a7](https://github.com/Flagsmith/flagsmith/commit/da2b4a7128a7b40605eed04774a703839777a841))

## [2.63.2](https://github.com/Flagsmith/flagsmith/compare/v2.63.1...v2.63.2) (2023-07-25)


### Bug Fixes

* ensure recurring tasks are unlocked after being picked up (but not executed) ([#2508](https://github.com/Flagsmith/flagsmith/issues/2508)) ([24c21ea](https://github.com/Flagsmith/flagsmith/commit/24c21ead348f5c3dc190468309459611336c4856))
* rendering recurring task admin times out ([#2514](https://github.com/Flagsmith/flagsmith/issues/2514)) ([cb95a92](https://github.com/Flagsmith/flagsmith/commit/cb95a925cc8907a8f37f76f48a840261c467372d))
* Update Hyperlink "Learn about Audit Webhooks" URL ([#2504](https://github.com/Flagsmith/flagsmith/issues/2504)) ([9ec20b5](https://github.com/Flagsmith/flagsmith/commit/9ec20b5214b95a9bfe481ac42511d1ff8fa1b3ea))

## [2.63.1](https://github.com/Flagsmith/flagsmith/compare/v2.63.0...v2.63.1) (2023-07-21)


### Bug Fixes

* **webhooks:** fix skipping webhooks calls on timeouts ([#2501](https://github.com/Flagsmith/flagsmith/issues/2501)) ([583e248](https://github.com/Flagsmith/flagsmith/commit/583e248cda58341b02ceeb5b75945550963a6dba))

## [2.63.0](https://github.com/Flagsmith/flagsmith/compare/v2.62.5...v2.63.0) (2023-07-21)


### Features

* **limits:** Add limits to features, segments and segment overrides ([#2480](https://github.com/Flagsmith/flagsmith/issues/2480)) ([d150c7f](https://github.com/Flagsmith/flagsmith/commit/d150c7f6c4b5e2336518b4dfba7895c61c2737a1))
* **tests:** test coverage ([#2482](https://github.com/Flagsmith/flagsmith/issues/2482)) ([1389c6e](https://github.com/Flagsmith/flagsmith/commit/1389c6eb8e39920fcc962c73c71fa096b902c260))

## [2.62.5](https://github.com/Flagsmith/flagsmith/compare/v2.62.4...v2.62.5) (2023-07-20)


### Bug Fixes

* **infra:** reduce number of threads per processor and increase sleep interval ([#2486](https://github.com/Flagsmith/flagsmith/issues/2486)) ([dd2516b](https://github.com/Flagsmith/flagsmith/commit/dd2516b222785dbc62003c9d054716f1c7d32e44))

## [2.62.4](https://github.com/Flagsmith/flagsmith/compare/v2.62.3...v2.62.4) (2023-07-19)


### Bug Fixes

* re-add EDGE_API_URL to api service task definition ([#2475](https://github.com/Flagsmith/flagsmith/issues/2475)) ([9554864](https://github.com/Flagsmith/flagsmith/commit/95548642edb40b5ec2fffdb6c1dcdab82a083181))

## [2.62.0](https://github.com/Flagsmith/flagsmith/compare/v2.61.0...v2.62.0) (2023-07-19)


### Features

* add descriptive event title to dynatrace integration ([#2424](https://github.com/Flagsmith/flagsmith/issues/2424)) ([f1dba53](https://github.com/Flagsmith/flagsmith/commit/f1dba5376b4bf1d2e9115f08998c8170678a8a80))


### Bug Fixes

* Allow signups when invited and in PREVENT_SIGNUP mode ([#2448](https://github.com/Flagsmith/flagsmith/issues/2448)) ([10719eb](https://github.com/Flagsmith/flagsmith/commit/10719ebb89eccb7bed83e5c43055d98c14724748))

## [2.61.0](https://github.com/Flagsmith/flagsmith/compare/v2.60.0...v2.61.0) (2023-07-16)


### Features

* Adjust AWS payment settings ([#2400](https://github.com/Flagsmith/flagsmith/issues/2400)) ([de4618d](https://github.com/Flagsmith/flagsmith/commit/de4618d02fbdffd774e7a34047590921c4c5bf4f))
* Bake enterprise version info into private cloud image ([#2420](https://github.com/Flagsmith/flagsmith/issues/2420)) ([acebf93](https://github.com/Flagsmith/flagsmith/commit/acebf939d80503d1b1fd964135646d06c7d0cb04))


### Bug Fixes

* (sales dashboard) correct api call overage data  ([#2434](https://github.com/Flagsmith/flagsmith/issues/2434)) ([c55e675](https://github.com/Flagsmith/flagsmith/commit/c55e675b023567b38e9750a3a5cc6b0a1859c209))
* ensure relevant email domains are not sent to Pipedrive ([#2431](https://github.com/Flagsmith/flagsmith/issues/2431)) ([3a4d8cb](https://github.com/Flagsmith/flagsmith/commit/3a4d8cbe8889389bbd7aefd9676f8c12cedf3c52))


### Documentation

* new architecture diagram ([#2433](https://github.com/Flagsmith/flagsmith/issues/2433)) ([2169340](https://github.com/Flagsmith/flagsmith/commit/21693404229f6705379be093c5a946f7bdcdda5f))
