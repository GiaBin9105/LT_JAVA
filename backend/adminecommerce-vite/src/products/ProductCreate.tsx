import { useState } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  CreateProps,
} from "react-admin";

export const ProductCreate = (props: CreateProps) => {
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://192.168.220.177:8080/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <Create {...props} title="➕ Create Product">
      <SimpleForm>
        {/* 🏷️ Tên sản phẩm */}
        <TextInput source="name" label="Product Name" fullWidth />

        {/* 💰 Giá theo size */}
        <NumberInput source="priceS" label="Price (Size S)" />
        <NumberInput source="priceM" label="Price (Size M)" />
        <NumberInput source="priceL" label="Price (Size L)" />

        {/* ⭐️ Đánh giá */}
        <NumberInput
          source="rating"
          label="Rating (0 - 5)"
          step={0.1}
          defaultValue={4.5}
        />

        {/* 📄 Mô tả */}
        <TextInput source="description" label="Description" multiline fullWidth />

        {/* 🧩 Danh mục */}
        <ReferenceInput source="category.id" reference="categories" label="Category">
          <SelectInput optionText="name" />
        </ReferenceInput>

        {/* 🖼 Upload ảnh */}
        <input type="file" accept="image/*" onChange={handleUpload} style={{ marginTop: 10 }} />

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              marginTop: 10,
              borderRadius: 10,
            }}
          />
        )}

        {/* 🔗 Lưu URL ảnh */}
        <TextInput
          source="image"
          label="Image URL"
          defaultValue={imageUrl}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
