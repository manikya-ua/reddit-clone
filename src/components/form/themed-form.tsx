import { type ThemeProps, withTheme } from "@rjsf/core";
import DescriptionFieldTemplate from "./templates/DescriptionFieldTemplate";
import ErrorListTemplate from "./templates/ErrorListTemplate";
import FieldErrorTemplate from "./templates/FieldErrorTemplate";
import FieldTemplate from "./templates/FieldTemplate";
import TitleFieldTemplate from "./templates/TitleFieldTemplate";
import EmailWidget from "./widgets/email-widget";
import PasswordWidget from "./widgets/password-widget";
import SelectWidget from "./widgets/select-widget";
import TextWidget from "./widgets/text-widget";
import TextareaWidget from "./widgets/textarea-widget";

const theme: ThemeProps = {
  widgets: {
    EmailWidget,
    PasswordWidget,
    TextWidget,
    SelectWidget,
    TextareaWidget,
  },
  templates: {
    TitleFieldTemplate,
    DescriptionFieldTemplate,
    FieldErrorTemplate,
    ErrorListTemplate,
    FieldTemplate,
  },
};

/**
 * It is the form with custom fields and templates, but is not passed with validator.
 * If you want use validator then use DefaultForm component
 */
export const ThemedForm = withTheme(theme);
