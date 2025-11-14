import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  ShowButton,
  DeleteButton,
} from "react-admin";

export const FavoriteList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="user.id" reference="users" label="User" />
      <ReferenceField source="product.id" reference="products" label="Product" />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
