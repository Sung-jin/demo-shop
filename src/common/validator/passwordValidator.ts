import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({ name: "passwordValidator", async: true })
export class PasswordValidator implements ValidatorConstraintInterface {
  constructor() {}
  async validate(password: string, args: ValidationArguments) {
    const minimumRegexHitCount = 3
    let passwordRegexHitCount = 0;

    if (password.match(new RegExp(/[$&+,:;=?@#|'<>.^*()%!-]/))) passwordRegexHitCount++;
    if (password.match(new RegExp(/[0-9]/))) passwordRegexHitCount++;
    if (password.match(new RegExp(/[a-zA-Z]/))) passwordRegexHitCount++;

    return (passwordRegexHitCount >= minimumRegexHitCount) && password.length >= 8;
  }

  defaultMessage(args: ValidationArguments) {
    return "Password too weak.";
  }
}