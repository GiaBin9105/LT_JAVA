import { Edit, SimpleForm, TextInput, NumberInput, SelectInput } from "react-admin";

export const OrderEdit = () => (
  <Edit title="✏️ Edit Order">
    <SimpleForm>
      {/* ⚙️ Trạng thái đơn hàng */}
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: "PENDING", name: "Pending" },
          { id: "PAID", name: "Paid" },
          { id: "SHIPPED", name: "Shipped" },
          { id: "CANCELLED", name: "Cancelled" },
        ]}
      />

      {/* 💰 Tổng tiền — chỉ đọc */}
      <NumberInput source="totalPrice" label="Total ($)" disabled />
    </SimpleForm>
  </Edit>
);
