import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  FunctionField,
} from "react-admin";

export const OrderShow = () => (
  <Show title="📦 Order Details">
    <SimpleShowLayout>
      {/* 🧾 Thông tin chung */}
      <TextField source="id" label="Order ID" />
      <TextField source="userName" label="Customer Name" />
      <TextField source="userEmail" label="Email" />
      <NumberField source="totalPrice" label="Total ($)" />
      <TextField source="status" label="Status" />

      {/* 🚚 Thông tin giao hàng */}
      <TextField source="address" label="Shipping Address" />
      <TextField source="phone" label="Phone Number" />

      <DateField source="createdAt" label="Created At" showTime />

      {/* 🧃 Danh sách sản phẩm trong đơn */}
      <FunctionField
        label="Products"
        render={(record: any) => {
          if (!record || !record.items || record.items.length === 0) {
            return <span>No items</span>;
          }

          return (
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "25px",
                marginTop: "8px",
              }}
            >
              {record.items.map((item: any, index: number) => (
                <li key={index} style={{ marginBottom: "6px" }}>
                  <strong>{item.productName}</strong>{" "}
                  <span style={{ color: "#8B5E3C" }}>
                    (Size: {item.size || "M"}, Qty: {item.quantity}, $
                    {item.price?.toFixed?.(2) || "—"})
                  </span>
                </li>
              ))}
            </ul>
          );
        }}
      />
    </SimpleShowLayout>
  </Show>
);
