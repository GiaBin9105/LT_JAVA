import { Edit, SimpleForm, TextInput, SelectInput } from "react-admin";

export const UserEdit = () => (
  <Edit title="✏️ Edit User">
    <SimpleForm>
      <TextInput source="id" label="ID" disabled fullWidth />
      <TextInput source="name" label="Full Name" fullWidth />
      <TextInput source="email" label="Email" fullWidth />
      <TextInput source="phone" label="Phone" fullWidth />
      <TextInput source="address" label="Address" fullWidth />
      <SelectInput
        source="role"
        label="Role"
        choices={[
          { id: "USER", name: "User" },
          { id: "ADMIN", name: "Admin" },
        ]}
      />
    </SimpleForm>
  </Edit>
);
