import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  NumberField,
  ShowButton,
  FunctionField,
} from "react-admin";

export const CartList = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="Cart ID" />
      <ReferenceField source="user.id" reference="users" label="User">
        <TextField source="email" />
      </ReferenceField>

      {/* ✅ Tổng tiền giỏ hàng (theo priceAtAdd) */}
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

      <FunctionField
        label="Items"
        render={(record: any) => record.items?.length || 0}
      />

      <ShowButton />
    </Datagrid>
  </List>
);
