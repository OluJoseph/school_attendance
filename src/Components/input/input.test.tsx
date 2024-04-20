import { fireEvent, render, screen } from "../../test/testUtils";
import Input from "./Input";

describe("input styles work as expected", () => {
  beforeEach(() => {
    render(
      <Input
        label="name"
        handleChange={null}
        value={"john"}
        name="name"
        errors={{ name: "required" }}
      />
    );
  });

  test("shows label as legend when provided", () => {
    expect(screen.getByText(/^name$/i)).toBeVisible();
  });

  test("shows error if theres an error", async () => {
    const container = screen.getByTestId("inputWrapper");

    fireEvent.blur(container);

    expect(screen.getByText("required")).toBeVisible();
  });

  test("displays correct value", async () => {
    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();

    expect(input).toHaveValue("john");
  });
});
