import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import useRequestResource from "../../hooks/useRequestResource";
import apiClient from "../../services/api";
// UI Components
import FormSection from "../../components/ui/FormSection";
import Icon from "../../components/ui/Icon";
import Button from "../../components/ui/Button";
import FormikTextInput from "../../components/ui/FormikTextInput";
import FormikTextArea from "../../components/ui/FormikTextArea";
import Token from "../../components/ui/Token";
import LocationAutocomplete from "../../components/Product/LocationAutocomplete";

// Icons
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloseIcon from "@mui/icons-material/Close";
import BrandAutocomplete from "../../components/Product/BrandAutocomplete";

export default function ListingForm() {
  const { id: listingId } = useParams();
  const isEditMode = Boolean(listingId);
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const {
    addResource,
    updateResource,
    resource: listingData,
    getResource,
  } = useRequestResource({
    endpoint: "listings",
    resourceLabel: "Listing",
  });
  const { resourceList: categories, getResourceList: getCategories } =
    useRequestResource({ endpoint: "categories" });

  useEffect(() => {
    getCategories();
    if (isEditMode) {
      getResource(listingId);
    }
  }, [getCategories, getResource, listingId, isEditMode]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: listingData?.title || "",
      description: listingData?.description || "",
      category: listingData?.category || "",
      brand: listingData?.brand || "",
      token_value: listingData?.token_value || "",
      condition: listingData?.condition || "very_good",
      size: listingData?.size || "",
      location: listingData?.location || "",
      latitude: listingData?.latitude || null,
      longitude: listingData?.longitude || null,
    },
    validate: (values) => {
      const errors = {};
      if (!values.title) errors.title = "Required";
      if (!values.token_value) errors.token_value = "Required";
      if (imagePreviews.length === 0) {
        errors.images = "At least one image is required.";
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (isEditMode && imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map((imageId) =>
            apiClient.delete(`/listing-images/${imageId}/`)
          )
        );
      }

      const formData = new FormData();
      for (const key in values) {
        if (values[key] !== null) {
          formData.append(key, values[key]);
        }
      }
      for (const file of imageFiles) {
        formData.append("uploaded_images", file);
      }

      const handleSuccess = () => {
        formik.resetForm();
        setSubmitting(false);
        navigate(isEditMode ? `/listings/${listingId}` : "/");
      };

      if (isEditMode) {
        updateResource(listingId, formData, handleSuccess);
      } else {
        addResource(formData, handleSuccess);
      }
    },
  });

  useEffect(() => {
    if (isEditMode && listingData?.images) {
      setImagePreviews(listingData.images.map((img) => img.image));
    }
  }, [listingData, isEditMode]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const previewToRemove = imagePreviews[indexToRemove];

    const existingImage = listingData?.images.find(
      (img) => img.image === previewToRemove
    );

    if (existingImage) {
      setImagesToDelete((prev) => [...prev, existingImage.id]);
    } else {
      const fileIndex = imageFiles.findIndex(
        (file) => URL.createObjectURL(file) === previewToRemove
      );
      if (fileIndex > -1) {
        setImageFiles((prev) => prev.filter((_, index) => index !== fileIndex));
      }
    }

    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <main className="bg-gray-50 py-10">
      <form onSubmit={formik.handleSubmit} className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {isEditMode ? "Edit your item" : "Sell your item"}
        </h2>
        <FormSection>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
              {imagePreviews.map((previewUrl, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 leading-none"
                    aria-label="Remove image"
                  >
                    <Icon className="!text-sm">
                      <CloseIcon fontSize="inherit" />
                    </Icon>
                  </button>
                </div>
              ))}
            </div>
            <label
              htmlFor="photo-upload"
              className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
              <Icon className="mr-2 -ml-1">
                <AddAPhotoIcon />
              </Icon>
              Add Photos
            </label>
            <input
              id="photo-upload"
              name="uploaded_images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            {formik.errors.images && (
              <div className="text-red-500 text-xs mt-2 text-center">
                {formik.errors.images}
              </div>
            )}
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
              </div>
            </div>
          </div>
        </FormSection>
        <FormSection>
          <LocationAutocomplete formik={formik} />
        </FormSection>
        <FormSection>
          <BrandAutocomplete formik={formik} />
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
                <Token />
              </span>
              {formik.touched.token_value && formik.errors.token_value ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.token_value}
                </div>
              ) : null}
            </div>
          </div>
        </FormSection>
        <div className="flex justify-end items-center space-x-4 mt-8">
          <Button
            variant="primary"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting
              ? "Submitting..."
              : isEditMode
              ? "Update Listing"
              : "Add Listing"}
          </Button>
        </div>
      </form>
    </main>
  );
}
