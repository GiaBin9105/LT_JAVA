import { Create, SimpleForm, TextInput, SelectInput, PasswordInput } from "react-admin";

export const UserCreate = () => (
  <Create title="➕ Create New User">
    <SimpleForm>
      <TextInput source="name" label="Full Name" fullWidth required />
      <TextInput source="email" label="Email" fullWidth required />
      <PasswordInput source="password" label="Password" fullWidth required />
      <TextInput source="phone" label="Phone" fullWidth />
      <TextInput source="address" label="Address" fullWidth />
      <SelectInput
        source="role"
        label="Role"
        choices={[
          { id: "USER", name: "User" },
          { id: "ADMIN", name: "Admin" },
        ]}
        defaultValue="USER"
      />
    </SimpleForm>
  </Create>
);
