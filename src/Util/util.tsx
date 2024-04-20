export function logout(setUser: any, navigate: any) {
  sessionStorage.clear();
  setUser(null);
  navigate("/");
}

export function updateFormValues(
  name: string,
  value: string,
  currentValues: any,
  setFormValues: any
) {
  setFormValues({ ...currentValues, [name]: value });
}

export function adjustTimezone(date: string) {
  let d = new Date(date);
  //   d = new Date(Number(d) + d.getTimezoneOffset() * 60000);
  return d;
}
