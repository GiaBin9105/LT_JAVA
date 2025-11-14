import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  ImageField,
  EditButton,
  DeleteButton,
} from "react-admin";

export const ProductList = () => (
  <List>
    <Datagrid rowClick="edit">
      {/* ID sản phẩm */}
      <TextField source="id" label="ID" />

      {/* Tên sản phẩm */}
      <TextField source="name" label="Product Name" />

      {/* Giá */}
      <NumberField source="price" label="Price ($)" />

      {/* ⭐ Rating */}
      <NumberField source="rating" label="⭐ Rating" />

      {/* Danh mục */}
      <ReferenceField
        source="category.id"
        reference="categories"
        label="Category"
      >
        <TextField source="name" />
      </ReferenceField>

      {/* Ảnh xem trước */}
      <ImageField
        source="image"
        label="Image"
        sx={{
          "& img": {
            width: 70,
            height: 70,
            objectFit: "cover",
            borderRadius: "10px",
          },
        }}
      />

      {/* Nút thao tác */}
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
