import Utils from '../../utils/utils';

module.exports = (envId, { FEATURE_NAME, FEATURE_FUNCTION, FEATURE_NAME_ALT }) => `use std::env;
use flagsmith::{Flag, Flagsmith, FlagsmithOptions};

let options = FlagsmithOptions {..Default::default()};
let flagsmith = Flagsmith::new(
        env::var("${envId}")
            .expect("FLAGSMITH_ENVIRONMENT_KEY not found in environment"),
        options,
    );

// The method below triggers a network request
let flags = flagsmith.get_environment_flags().unwrap();

// Check for a feature
let show_button = flags.is_feature_enabled("${FEATURE_NAME}").unwrap();

let button_data = flags.get_feature_value_as_string("${FEATURE_NAME_ALT}").unwrap();
`;
