module.exports = (envId, { LIB_NAME, USER_ID, LIB_NAME_JAVA, FEATURE_NAME, FEATURE_FUNCTION, FEATURE_NAME_ALT, FEATURE_NAME_ALT_VALUE, NPM_CLIENT }, userId) => `var testUser = flagsmith.User{Identifier: "${USER_ID}"}

client := flagsmith.DefaultClient("${envId}")

trait := flagsmith.Trait{TraitKey: "trait", TraitValue: "trait_value"}
traits = []*flagsmith.Trait{&trait}

// The method below triggers a network request
flags, _ := client.GetIdentityFlags(identifier, traits)

showButton, _ := flags.IsFeatureEnabled("${FEATURE_NAME}")
buttonData, _ := flags.GetFeatureValue("${FEATURE_NAME_ALT}")
`;
