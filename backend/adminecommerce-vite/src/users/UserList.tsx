import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  DeleteButton,
} from "react-admin";

export const UserList = () => (
  <List title="👥 Users" sort={{ field: "id", order: "ASC" }}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Full Name" />
      <EmailField source="email" label="Email" />
      <TextField source="phone" label="Phone" />
      <TextField source="address" label="Address" />
      <TextField source="role" label="Role" />
      <EditButton label="" />
      <DeleteButton label="" />
    </Datagrid>
  </List>
);
