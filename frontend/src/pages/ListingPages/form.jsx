import { useEffect, useState } from "react";
import FormSection from "../../components/ui/FormSection";
import Icon from "../../components/ui/Icon";
import Button from "../../components/ui/Button";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import useRequestResource from "../../hooks/useRequestResource";
import { useFormik } from "formik";
import FormikTextInput from "../../components/ui/FormikTextInput";
import FormikTextArea from "../../components/ui/FormikTextArea";

// export default function ListingForm() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     price: "",
//     brand: "",
//   });
//   const [image, setImage] = useState(null);
//   const [imageBase64, setImageBase64] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       setImage(URL.createObjectURL(file));
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImageBase64(reader.result.split(",")[1]);
//       };
//       reader.readAsDataURL(file);
//       setError("");
//     } else {
//       setError("Please select a valid image file.");
//       setImage(null);
//       setImageBase64("");
//     }
//   };

//   const generateDetailsWithAI = async () => {
//     if (!imageBase64) {
//       setError("Please upload an image first to use the AI feature.");
//       return;
//     }
//     setIsLoading(true);
//     setError("");

//     const prompt =
//       "Analyze this image of an item for a marketplace. Provide a short, catchy title, a detailed description, a suggested price in Tokens, the item's brand, and a suggested category from this list: 'Women', 'Men', 'Kids', 'Home'. Return a JSON object with keys: 'title', 'description', 'price', 'brand', and 'category'.";

//     try {
//       const apiKey = ""; // Canvas provides the key
//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
//       const payload = {
//         contents: [
//           {
//             parts: [
//               { text: prompt },
//               { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
//             ],
//           },
//         ],
//         generationConfig: { responseMimeType: "application/json" },
//       };

//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!response.ok) throw new Error(`API error: ${response.status}`);
//       const result = await response.json();

//       if (result.candidates && result.candidates.length > 0) {
//         const content = JSON.parse(result.candidates[0].content.parts[0].text);
//         setFormData((prev) => ({
//           ...prev,
//           title: content.title || "",
//           description: content.description || "",
//           price: content.price || "",
//           brand: content.brand || "",
//           category: content.category || "",
//         }));
//       } else {
//         throw new Error("No content was generated.");
//       }
//     } catch (err) {
//       console.error("Gemini API Error:", err);
//       setError("Failed to generate details. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <main className="bg-gray-50 py-10">
//       <div className="max-w-4xl mx-auto">
//         <h2 className="text-2xl font-semibold mb-6">Sell your item</h2>
//         <FormSection>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//             {image ? (
//               <img
//                 src={image}
//                 alt="Item preview"
//                 className="max-h-48 mx-auto mb-4"
//               />
//             ) : (
//               <label
//                 htmlFor="photo-upload"
//                 className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
//               >
//                 {" "}
//                 <Icon className="mr-2 -ml-1">
//                   <AddAPhotoIcon />
//                 </Icon>{" "}
//                 Add photos{" "}
//               </label>
//             )}
//             <input
//               id="photo-upload"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="hidden"
//             />
//           </div>
//           <div className="mt-4 bg-teal-50 text-teal-800 p-3 rounded-md flex items-center text-sm">
//             {" "}
//             <Icon className="mr-2">info</Icon>{" "}
//             <span>
//               Attract buyers - use quality photos.{" "}
//               <a href="#" className="font-semibold underline">
//                 Discover how
//               </a>
//             </span>{" "}
//           </div>
//           <div className="mt-4">
//             {" "}
//             <Button
//               onClick={generateDetailsWithAI}
//               disabled={!image || isLoading}
//               className="w-full md:w-auto"
//             >
//               {" "}
//               {isLoading ? "Generating..." : "✨ Fill details with AI"}{" "}
//             </Button>{" "}
//             {error && <p className="text-red-500 text-xs mt-2">{error}</p>}{" "}
//           </div>
//         </FormSection>
//         <FormSection>
//           <div className="space-y-4">
//             <TextInput
//               label="Title"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               placeholder="e.g. Green Sézane shirt"
//             />
//             <hr />
//             <TextArea
//               label="Describe your item"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="e.g. worn a few times, good condition"
//             />
//           </div>
//         </FormSection>
//         <FormSection>
//           <div className="space-y-4">
//             <div className="flex items-center">
//               <label htmlFor="category" className="w-1/4 text-sm text-gray-600">
//                 Category
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 className="w-3/4 p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none bg-transparent"
//               >
//                 <option value="">Select a category</option>
//                 <option value="Women">Women</option>{" "}
//                 <option value="Men">Men</option>{" "}
//                 <option value="Kids">Kids</option>{" "}
//                 <option value="Home">Home</option>
//               </select>
//             </div>
//             <hr />
//             <TextInput
//               label="Brand"
//               name="brand"
//               value={formData.brand}
//               onChange={handleInputChange}
//               placeholder="e.g. Nike, Sézane, etc."
//             />
//           </div>
//         </FormSection>
//         <FormSection>
//           <div className="flex items-center">
//             <label htmlFor="price" className="w-1/4 text-sm text-gray-600">
//               Price
//             </label>
//             <div className="w-3/4 relative">
//               <input
//                 type="number"
//                 id="price"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 placeholder="0.00"
//                 className="p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none w-full"
//               />
//               <span className="absolute right-2 top-2 text-gray-500">
//                 Tokens
//               </span>
//             </div>
//           </div>
//         </FormSection>
//         <div className="border border-gray-200 rounded-lg p-4 mb-6 flex justify-between items-center">
//           {" "}
//           <p className="text-sm text-gray-600">
//             What do you think of our new listing process?
//           </p>{" "}
//           <Button variant="secondary">Give feedback</Button>{" "}
//         </div>
//         <p className="text-xs text-gray-500 mb-6">
//           A professional seller must register as a professional on EcoTroc and
//           is subject to the sections provided in Terms 1, T&C 2, and the
//           Consumer Code.
//         </p>
//         <div className="flex justify-end items-center space-x-4">
//           {" "}
//           <Button variant="secondary">Save draft</Button>{" "}
//           <Button variant="primary">Add</Button>{" "}
//         </div>
//       </div>
//     </main>
//   );
// }

export default function ListingForm() {
  // --- State for non-Formik values ---
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // --- API Hooks ---
  const { addResource, error: apiError } = useRequestResource({
    endpoint: "listings",
    resourceLabel: "Listing",
  });
  const { resourceList: categories, getResourceList: getCategories } =
    useRequestResource({ endpoint: "categories" });

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // --- Formik Setup ---
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      brand: "",
      token_value: "",
      condition: "very_good",
      size: "",
    },
    // --- Basic Validation Example ---
    validate: (values) => {
      const errors = {};
      if (!values.title) errors.title = "Required";
      if (!values.token_value) errors.token_value = "Required";
      else if (isNaN(values.token_value) || Number(values.token_value) <= 0)
        errors.token_value = "Must be a positive number";
      if (!values.category) errors.category = "Please select a category";
      if (!values.condition) errors.condition = "Please select a condition";
      return errors;
    },
    // --- Submission Handler ---
    onSubmit: (values, { setSubmitting }) => {
      const formData = new FormData();

      for (const key in values) {
        formData.append(key, values[key]);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      addResource(formData, () => {
        formik.resetForm();
        setImagePreview(null);
        setImageFile(null);
        setSubmitting(false);
      });
    },
  });

  // --- Image Handling ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAiError("");
    } else {
      setAiError("Please select a valid image file.");
      setImagePreview(null);
      setImageFile(null);
    }
  };

  // --- Gemini AI Integration ---
  const generateDetailsWithAI = async () => {
    if (!imageFile) {
      setAiError("Please upload an image first to use the AI feature.");
      return;
    }
    setAiLoading(true);
    setAiError("");

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = async () => {
      const imageBase64 = reader.result.split(",")[1];
      const prompt = `Analyze this image of an item for a marketplace. Provide a short, catchy title, a detailed description, a suggested price in Tokens, the item's brand, its size (e.g., "M", "L", "One Size"), and a suggested condition from this list: "new_with_tag", "new_without_tag", "very_good", "good", "satisfactory". Return a JSON object with keys: 'title', 'description', 'price', 'brand', 'size', and 'condition'.`;

      try {
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = {
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType: imageFile.type, data: imageBase64 } },
              ],
            },
          ],
          generationConfig: { responseMimeType: "application/json" },
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0) {
          const content = JSON.parse(
            result.candidates[0].content.parts[0].text
          );
          formik.setFieldValue("title", content.title || "");
          formik.setFieldValue("description", content.description || "");
          formik.setFieldValue("token_value", content.price || "");
          formik.setFieldValue("brand", content.brand || "");
          formik.setFieldValue("size", content.size || "");
          formik.setFieldValue("condition", content.condition || "very_good");
        } else {
          throw new Error("No content was generated.");
        }
      } catch (err) {
        console.error("Gemini API Error:", err);
        setAiError("Failed to generate details. Please try again.");
      } finally {
        setAiLoading(false);
      }
    };
  };

  return (
    <main className="bg-gray-50 py-10">
      <form onSubmit={formik.handleSubmit} className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Sell your item</h2>
        <FormSection>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Item preview"
                className="max-h-48 mx-auto mb-4"
              />
            ) : (
              <label
                htmlFor="photo-upload"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
              >
                <Icon className="mr-2 -ml-1">
                  <AddAPhotoIcon />
                </Icon>{" "}
                Add photos
              </label>
            )}
            <input
              id="photo-upload"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="mt-4 bg-teal-50 text-teal-800 p-3 rounded-md flex items-center text-sm">
            <Icon className="mr-2">info</Icon>
            <span>
              Attract buyers - use quality photos.{" "}
              <a href="#" className="font-semibold underline">
                Discover how
              </a>
            </span>
          </div>
          <div className="mt-4">
            <Button
              onClick={generateDetailsWithAI}
              disabled={!imageFile || aiLoading}
              className="w-full md:w-auto"
              type="button"
            >
              {aiLoading ? "Generating..." : "✨ Fill details with AI"}
            </Button>
            {aiError && <p className="text-red-500 text-xs mt-2">{aiError}</p>}
          </div>
        </FormSection>

        <FormSection>
          <div className="space-y-4">
            <FormikTextInput
              formik={formik}
              label="Title"
              name="title"
              placeholder="e.g. Green Sézane shirt"
            />
            <hr />
            <FormikTextArea
              formik={formik}
              label="Describe your item"
              name="description"
              placeholder="e.g. worn a few times, good condition"
            />
          </div>
        </FormSection>

        <FormSection>
          <div className="space-y-4">
            <div className="flex items-center">
              <label htmlFor="category" className="w-1/4 text-sm text-gray-600">
                Category
              </label>
              <div className="w-3/4 flex flex-col">
                <select
                  id="category"
                  name="category"
                  {...formik.getFieldProps("category")}
                  className="p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none bg-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.results.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.category}
                  </div>
                ) : null}
              </div>
            </div>
            <hr />
            <FormikTextInput
              formik={formik}
              label="Brand"
              name="brand"
              placeholder="e.g. Nike, Sézane, etc."
            />
            <hr />
            <FormikTextInput
              formik={formik}
              label="Size"
              name="size"
              placeholder="e.g. M, 42, One Size"
            />
            <hr />
            <div className="flex items-center">
              <label
                htmlFor="condition"
                className="w-1/4 text-sm text-gray-600"
              >
                Condition
              </label>
              <div className="w-3/4 flex flex-col">
                <select
                  id="condition"
                  name="condition"
                  {...formik.getFieldProps("condition")}
                  className="p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none bg-transparent"
                >
                  <option value="new_with_tag">New with tag</option>
                  <option value="new_without_tag">New without tag</option>
                  <option value="very_good">Very good</option>
                  <option value="good">Good</option>
                  <option value="satisfactory">Satisfactory</option>
                </select>
                {formik.touched.condition && formik.errors.condition ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.condition}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection>
          <div className="flex items-center">
            <label
              htmlFor="token_value"
              className="w-1/4 text-sm text-gray-600"
            >
              Price
            </label>
            <div className="w-3/4 relative">
              <input
                type="number"
                id="token_value"
                name="token_value"
                {...formik.getFieldProps("token_value")}
                placeholder="0.00"
                className="p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none w-full"
              />
              <span className="absolute right-2 top-2 text-gray-500">
                Tokens
              </span>
              {formik.touched.token_value && formik.errors.token_value ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.token_value}
                </div>
              ) : null}
            </div>
          </div>
        </FormSection>

        {apiError && (
          <p className="text-red-500 text-sm mb-4 text-center">{apiError}</p>
        )}

        <div className="border border-gray-200 rounded-lg p-4 mb-6 flex justify-between items-center">
          {" "}
          <p className="text-sm text-gray-600">
            What do you think of our new listing process?
          </p>{" "}
          <Button variant="secondary">Give feedback</Button>{" "}
        </div>
        <p className="text-xs text-gray-500 mb-6">
          A professional seller must register as a professional on EcoTroc and
          is subject to the sections provided in Terms 1, T&C 2, and the
          Consumer Code.
        </p>

        <div className="flex justify-end items-center space-x-4">
          <Button variant="secondary" type="button">
            Save draft
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Submitting..." : "Add"}
          </Button>
        </div>
      </form>
    </main>
  );
}
