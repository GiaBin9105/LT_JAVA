import { Edit, SimpleForm, TextInput } from "react-admin";

export const CategoryEdit = (props) => (
  <Edit {...props} title="✏️ Edit Category">
    <SimpleForm>
      <TextInput source="id" label="ID" disabled />
      <TextInput source="name" label="Category Name" fullWidth />
    </SimpleForm>
  </Edit>
);
