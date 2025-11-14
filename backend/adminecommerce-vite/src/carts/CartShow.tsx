import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ReferenceField,
  FunctionField,
  ArrayField,
  Datagrid,
} from "react-admin";

export const CartShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="Cart ID" />
      <ReferenceField source="user.id" reference="users" label="User">
        <TextField source="email" />
      </ReferenceField>

      {/* ✅ Tổng tiền giỏ hàng */}
      <FunctionField
        label="Total Price ($)"
        render={(record: any) =>
          record.items
            ? record.items
                .reduce(
                  (sum: number, i: any) =>
                    sum + (i.priceAtAdd ?? i.product?.price ?? 0) * i.quantity,
                  0
                )
                .toFixed(2)
            : "0.00"
        }
      />

      {/* ✅ Danh sách sản phẩm trong giỏ */}
      <ArrayField source="items" label="Products in Cart">
        <Datagrid>
          <ReferenceField source="product.id" reference="products" label="Product">
            <TextField source="name" />
          </ReferenceField>

          {/* 👕 Size đã chọn */}
          <TextField source="size" label="Size" />

          {/* 🔢 Số lượng */}
          <NumberField source="quantity" label="Qty" />

          {/* 💰 Giá tại thời điểm thêm (priceAtAdd) */}
          <NumberField source="priceAtAdd" label="Price at Add ($)" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
