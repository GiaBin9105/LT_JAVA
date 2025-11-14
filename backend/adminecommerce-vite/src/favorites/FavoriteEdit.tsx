import {
  Edit,
  SimpleForm,
  ReferenceInput,
  SelectInput,
} from "react-admin";

export const FavoriteEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="user.id" reference="users" label="User">
        <SelectInput optionText="email" />
      </ReferenceInput>

      <ReferenceInput source="product.id" reference="products" label="Product">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
