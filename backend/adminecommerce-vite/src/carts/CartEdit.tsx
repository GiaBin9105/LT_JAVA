import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceField,
  TextField,
  ArrayField,
  Datagrid,
  NumberField,
} from "react-admin";

export const CartEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled label="Cart ID" />
      <ReferenceField source="user.id" reference="users" label="User">
        <TextField source="email" />
      </ReferenceField>

      <ArrayField source="items" label="Cart Items">
        <Datagrid>
          <ReferenceField source="product.id" reference="products" label="Product">
            <TextField source="name" />
          </ReferenceField>
          <TextField source="size" />
          <NumberField source="quantity" />
          <NumberField source="priceAtAdd" label="Price at Add ($)" />
        </Datagrid>
      </ArrayField>
    </SimpleForm>
  </Edit>
);
