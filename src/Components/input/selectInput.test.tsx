import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "../../test/testUtils";
import SelectInput from "./SelectInput";

describe("input styles work as expected", () => {
  beforeEach(() => {
    render(
      <SelectInput
        label="personName"
        handleChange={() => {}}
        name="name"
        errors={{ name: "required" }}
        options={["", "selection"]}
      />
    );
  });

  test("shows label as legend when provided", () => {
    expect(screen.getByText(/^personname$/i)).toBeVisible();
  });

  test("shows error if theres an error", async () => {
    const container = screen.getByTestId("selectInputWrapper");

    fireEvent.blur(container);

    expect(screen.getByText("required")).toBeVisible();
  });

  test("displays correct value", async () => {
    const input = screen.getByRole("combobox");

    expect(input).toBeInTheDocument();

    expect(input).toHaveValue("");

    userEvent.selectOptions(input, "selection");
	
    expect(input).toHaveValue("selection");
  });
});
