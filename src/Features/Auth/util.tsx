export const validateEmail = (email: string): boolean => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email.toLowerCase()
  );
};

function validatePattern(pattern: RegExp, value: string) {
  return pattern.test(value);
}
// for now this function is comparing a validation schema and the actual form values in the
// email and required validations. These are the only types being used
export const getErrors = (
  formValues: any,
  validationSchema: any,
  targetName: any = null
) => {
  let errors = {};

  if (!validationSchema) {
    return errors;
  }

  // if theres an event, only validate the input that emits the event
  // otherwise validate all inputs
  for (const name in formValues) {
    if ((targetName !== null && targetName !== name) || !validationSchema[name])
      continue;
    const nameValidationSchema = validationSchema[name];

    if (nameValidationSchema.required && !formValues[name]) {
      errors = { ...errors, [name]: "Required" };
    } else if (nameValidationSchema.email && !validateEmail(formValues[name])) {
      errors = { ...errors, [name]: "Invalid email" };
    } else if (
      nameValidationSchema.regex &&
      !validatePattern(nameValidationSchema.regex, formValues[name])
    ) {
      errors = { ...errors, [name]: "Invalid pattern" };
    }
  }

  return errors;
};

export function validate(
  targetName: any = null,
  formValues: any,
  validationSchema: any,
  stateCallback: any,
  errors: any
): boolean {
  const newErors: any = getErrors(formValues, validationSchema, targetName);
  // if validating an input event, spread operator keeps existing errors so new errors do not override
  // else validate is called when submitting, and newError covers all inputs
  let updatedErrors = !targetName ? newErors : { ...errors, ...newErors };
  stateCallback(updatedErrors);

  return Object.keys(updatedErrors).length === 0;
}
