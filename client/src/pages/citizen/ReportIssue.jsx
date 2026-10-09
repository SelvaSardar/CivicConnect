import { useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  MapPin,
  Send,
  LocateFixed,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import "./ReportIssue.css";

/* =========================
   LEAFLET MARKER ICON
========================= */

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

/* =========================
   CATEGORIES
========================= */

const categories = [
  "Road",
  "Street Light",
  "Garbage",
  "Water",
  "Drainage",
  "Electricity",
  "Public Safety",
  "Other",
];

/* =========================
   DEFAULT MAP LOCATION
========================= */

const defaultLocation = [13.0827, 80.2707];

/* =========================
   MAP CLICK HANDLER
========================= */

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      setPosition([lat, lng]);
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={defaultIcon}
    />
  ) : null;
};

/* =========================
   IMAGE COMPRESS FUNCTION
========================= */

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.onload = () => {
        const maxWidth = 1280;
        const maxHeight = 1280;

        let width = image.width;
        let height = image.height;

        /* Maintain image ratio */

        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;

          const ratio = Math.min(
            widthRatio,
            heightRatio
          );

          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(
            new Error("Unable to process image")
          );
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        /*
          Convert image to compressed JPEG.
          Quality = 0.75
        */

        const compressedImage =
          canvas.toDataURL(
            "image/jpeg",
            0.75
          );

        resolve(compressedImage);
      };

      image.onerror = () => {
        reject(
          new Error("Invalid image file")
        );
      };

      image.src = event.target.result;
    };

    reader.onerror = () => {
      reject(
        new Error("Unable to read image")
      );
    };

    reader.readAsDataURL(file);
  });
};

/* =========================
   REPORT ISSUE
========================= */

const ReportIssue = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
  });

  const [position, setPosition] = useState(null);

  const [image, setImage] = useState(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isGettingLocation, setIsGettingLocation] =
    useState(false);

  const [isProcessingImage, setIsProcessingImage] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  /* =========================
     IMAGE CHANGE
  ========================= */

  const handleImageChange = (event) => {
    const selectedImage =
      event.target.files?.[0];

    if (!selectedImage) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    /* Only images */

    if (!selectedImage.type.startsWith("image/")) {
      setErrorMessage(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    /* Maximum original file size: 5MB */

    if (
      selectedImage.size >
      5 * 1024 * 1024
    ) {
      setErrorMessage(
        "Image size must be less than 5MB."
      );

      event.target.value = "";
      return;
    }

    setImage(selectedImage);
  };

  /* =========================
     GET CURRENT LOCATION
  ========================= */

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage(
        "Location services are not supported by your browser."
      );

      return;
    }

    setIsGettingLocation(true);
    setErrorMessage("");
    setSuccessMessage("");

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const latitude =
          location.coords.latitude;

        const longitude =
          location.coords.longitude;

        setPosition([
          latitude,
          longitude,
        ]);

        setIsGettingLocation(false);

        setSuccessMessage(
          "Your current location has been selected."
        );
      },

      () => {
        setIsGettingLocation(false);

        setErrorMessage(
          "Unable to get your location. Please allow location access or select a location on the map."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    /* Required field validation */

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.address.trim()
    ) {
      setErrorMessage(
        "Please fill in all required fields."
      );

      return;
    }

    /* Map location validation */

    if (!position) {
      setErrorMessage(
        "Please select the complaint location on the map."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      let imageBase64 = "";

      /* =========================
         PROCESS IMAGE
      ========================= */

      if (image) {
        setIsProcessingImage(true);

        try {
          imageBase64 =
            await compressImage(image);
        } catch (imageError) {
          console.error(
            "Image processing error:",
            imageError
          );

          setErrorMessage(
            "Unable to process the selected image."
          );

          setIsSubmitting(false);
          setIsProcessingImage(false);

          return;
        }

        setIsProcessingImage(false);
      }

      /* =========================
         COMPLAINT DATA
      ========================= */

      const complaintData = {
        title: formData.title.trim(),

        description:
          formData.description.trim(),

        category: formData.category,

        location: {
          address:
            formData.address.trim(),

          latitude: position[0],

          longitude: position[1],
        },

        image: imageBase64,
      };

      /* =========================
         API REQUEST
      ========================= */

      await api.post(
        "/complaints",
        complaintData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      /* =========================
         SUCCESS
      ========================= */

      setSuccessMessage(
        "Complaint submitted successfully."
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        address: "",
      });

      setPosition(null);

      setImage(null);

      const fileInput =
        document.getElementById(
          "complaint-image"
        );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Complaint submission error:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to submit complaint. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setIsProcessingImage(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="report-page">

      {/* HEADER */}

      <header className="report-header">

        <button
          type="button"
          className="report-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <ArrowLeft size={19} />

          Back to Dashboard
        </button>

        <div className="report-header-title">

          <span>
            Citizen Portal
          </span>

          <h1>
            Report an Issue
          </h1>

        </div>

      </header>

      {/* MAIN */}

      <main className="report-content">

        {/* INTRO */}

        <section className="report-intro">

          <div>

            <span className="report-badge">
              Community Action
            </span>

            <h2>
              Help improve your community.
            </h2>

            <p>
              Report a civic issue with the
              details below. Your complaint
              will be reviewed and assigned
              to the appropriate staff member.
            </p>

          </div>

          <div className="report-intro-icon">
            <MapPin size={30} />
          </div>

        </section>

        {/* SUCCESS MESSAGE */}

        {successMessage && (
          <div className="report-message report-success">
            {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {errorMessage && (
          <div className="report-message report-error">
            {errorMessage}
          </div>
        )}

        {/* FORM */}

        <form
          className="report-form-card"
          onSubmit={handleSubmit}
        >

          {/* FORM HEADING */}

          <div className="report-form-heading">

            <div>

              <span>
                Complaint Information
              </span>

              <h2>
                Tell us what happened
              </h2>

            </div>

            <p>
              Fields marked with * are required.
            </p>

          </div>

          {/* FORM GRID */}

          <div className="report-form-grid">

            {/* TITLE */}

            <div className="report-field report-field-full">

              <label htmlFor="title">
                Issue Title{" "}
                <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Large pothole near main road"
                maxLength={100}
              />

              <small>
                Give your complaint a short
                and clear title.
              </small>

            </div>

            {/* CATEGORY */}

            <div className="report-field">

              <label htmlFor="category">
                Category{" "}
                <span>*</span>
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >

                <option value="">
                  Select a category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* ADDRESS */}

            <div className="report-field">

              <label htmlFor="address">
                Location Address{" "}
                <span>*</span>
              </label>

              <div className="report-input-icon">

                <MapPin size={17} />

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter the issue location"
                />

              </div>

            </div>

            {/* MAP */}

            <div className="report-field report-field-full">

              <div className="report-location-header">

                <div>

                  <label>
                    Select Location on Map{" "}
                    <span>*</span>
                  </label>

                  <small>
                    Click anywhere on the map
                    to select the complaint
                    location.
                  </small>

                </div>

                <button
                  type="button"
                  className="report-current-location-button"
                  onClick={
                    handleGetCurrentLocation
                  }
                  disabled={
                    isGettingLocation
                  }
                >

                  <LocateFixed size={17} />

                  {isGettingLocation
                    ? "Getting Location..."
                    : "Use My Location"}

                </button>

              </div>

              <div className="report-map-wrapper">

                <MapContainer
                  center={defaultLocation}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="report-map"
                >

                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <LocationMarker
                    position={position}
                    setPosition={
                      setPosition
                    }
                  />

                </MapContainer>

              </div>

              {/* COORDINATES */}

              {position && (
                <div className="report-location-coordinates">

                  <div>

                    <span>
                      Latitude
                    </span>

                    <strong>
                      {position[0].toFixed(
                        6
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Longitude
                    </span>

                    <strong>
                      {position[1].toFixed(
                        6
                      )}
                    </strong>

                  </div>

                </div>
              )}

              {!position && (
                <small className="report-map-help">
                  📍 No location selected yet.
                  Click the map or use "Use
                  My Location".
                </small>
              )}

            </div>

            {/* DESCRIPTION */}

            <div className="report-field report-field-full">

              <label htmlFor="description">
                Description{" "}
                <span>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                placeholder="Describe the issue clearly..."
                rows="7"
                maxLength={1000}
              />

              <div className="report-character-count">
                {formData.description.length}
                /1000
              </div>

            </div>

            {/* IMAGE */}

            <div className="report-field report-field-full">

              <label htmlFor="complaint-image">
                Add Image
              </label>

              <label
                htmlFor="complaint-image"
                className="report-upload"
              >

                <ImagePlus size={24} />

                <div>

                  <strong>
                    {image
                      ? image.name
                      : "Upload an image"}
                  </strong>

                  <span>
                    Add a photo to help explain
                    the issue (optional)
                  </span>

                </div>

              </label>

              <input
                id="complaint-image"
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                hidden
              />

              {image && (
                <small>
                  Image selected successfully.
                  It will be compressed before
                  submission.
                </small>
              )}

            </div>

          </div>

          {/* FOOTER */}

          <div className="report-form-footer">

            <p>
              Your complaint will initially
              be marked as
              <strong> Pending</strong>.
            </p>

            <div className="report-actions">

              <button
                type="button"
                className="report-cancel-button"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="report-submit-button"
                disabled={
                  isSubmitting ||
                  isProcessingImage
                }
              >

                <Send size={18} />

                {isProcessingImage
                  ? "Processing Image..."
                  : isSubmitting
                  ? "Submitting..."
                  : "Submit Complaint"}

              </button>

            </div>

          </div>

        </form>

      </main>

    </div>
  );
};

export default ReportIssue;