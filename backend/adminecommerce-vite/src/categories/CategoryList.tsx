import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
} from "react-admin";

export const CategoryList = () => (
  <List title="Categories">
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Category Name" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
