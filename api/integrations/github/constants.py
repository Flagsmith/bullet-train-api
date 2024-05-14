from core.helpers import get_current_site_url

GITHUB_API_URL = "https://api.github.com/"
GITHUB_API_VERSION = "2022-11-28"

LINK_FEATURE_TITLE = """**Flagsmith feature linked:** `%s`
Default Values:\n"""
FEATURE_TABLE_HEADER = """| Environment | Enabled | Value | Type | Updated (UTC) |
| :--- | :----- | :------ | :------- | :------ |\n"""
FEATURE_TABLE_ROW = "| [%s](%s) | %s | `%s` | %s | %s |\n"
LINK_SEGMENT_TITLE = "Segment `%s` values:\n"
UNLINKED_FEATURE_TEXT = "### The feature flag `%s` was unlinked from the issue/PR"
UPDATED_FEATURE_TEXT = "Flagsmith Feature `%s` has been updated:\n"
LAST_UPDATED_FEATURE_TEXT = "Last Updated %s"
DELETED_FEATURE_TEXT = "### The Feature Flag `%s` was deleted"
FEATURE_ENVIRONMENT_URL = (
    get_current_site_url() + "/project/%s/environment/%s/features?feature=%s&tab=%s"
)
