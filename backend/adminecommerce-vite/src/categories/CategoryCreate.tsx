import { Create, SimpleForm, TextInput, useNotify } from "react-admin";

export const CategoryCreate = (props: any) => {
  const notify = useNotify();

  // ✅ validate function thay vì onSubmit
  const validateCategory = (values: any) => {
    const errors: Record<string, string> = {};
    if (!values.name || values.name.trim() === "") {
      errors.name = "Category name cannot be empty!";
      notify("⚠️ Please enter a category name.", { type: "warning" });
    }
    return errors;
  };

  return (
    <Create {...props} title="➕ Create Category">
      <SimpleForm validate={validateCategory}>
        <TextInput
          source="name"
          label="Category Name"
          fullWidth
          helperText="Enter the name of the category (e.g., Latte, Macchiato...)"
        />
      </SimpleForm>
    </Create>
  );
};
