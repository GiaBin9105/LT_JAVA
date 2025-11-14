import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ShowButton,
  FunctionField,
} from "react-admin";

export const OrderList = () => (
  <List>
    <Datagrid>
      <TextField source="id" label="Order ID" />
      <TextField source="userName" label="Customer" />
      <TextField source="userEmail" label="Email" />
      <NumberField source="itemCount" label="Items" />
      <NumberField source="totalPrice" label="Total ($)" />
      <TextField source="status" label="Status" />
      <DateField source="createdAt" label="Created At" showTime />

      {/* ✅ Hiển thị sản phẩm + size + số lượng */}
      <FunctionField
        label="Products"
        render={(record: any) =>
          record.items
            ? record.items
                .map(
                  (i: any) =>
                    `${i.productName} [${i.size ?? "—"}] x${i.quantity} (${
                      i.price?.toFixed?.(2) ?? "—"
                    })`
                )
                .join(", ")
            : "—"
        }
      />

      <ShowButton />
    </Datagrid>
  </List>
);
