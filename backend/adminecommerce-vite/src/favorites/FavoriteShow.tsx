import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
} from "react-admin";

export const FavoriteShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="user.id" reference="users" label="User" />
      <ReferenceField source="product.id" reference="products" label="Product" />
    </SimpleShowLayout>
  </Show>
);
