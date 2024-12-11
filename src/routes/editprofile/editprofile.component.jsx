import './editprofile.style.scss';
import { UserContext } from "../../context/user.context";
import { useContext, useState, useRef } from "react";
import DefaultBgImage from "../../assets/default-bg.png";
import Edit_Icon from "../../assets/edit-icon.png";
import Back_arrow from "../../assets/back-arrow.png";
import Buttons from '../../components/buttons/buttons.component';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utilities"; // Assuming the db export is set up correctly
import { useNavigate } from 'react-router-dom';
const EditProfile = () => {
    const { currentUser, userDetails } = useContext(UserContext);
    const { photoURL, displayName, email, bg, bio } = userDetails;

    const [backgroundImage, setBackgroundImage] = useState(bg);
    const [profileImage, setProfileImage] = useState(photoURL);
    const [name, setName] = useState(displayName);
    const [bioText, setBioText] = useState(bio);
    const navigate = useNavigate()
    const handleBack = () => {
        navigate('/profile')
    }

    const fileInputRef = useRef(null);
    const userProfileRef = useRef(null);

    if (!currentUser) return null;

    const handleBgUpdate = () => {
        fileInputRef.current.click();
    };

    const profileUpdateHandler = () => {
        userProfileRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Upload image to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "sudarshan_preset_upload"); // Use your Cloudinary preset here

            fetch("https://api.cloudinary.com/v1_1/dlgulcrz2/image/upload", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    const imageUrl = data.secure_url; // Get the secure 
                    console.log(imageUrl);
                    setBackgroundImage(imageUrl); // Update the state with the Cloudinary URL
                })
                .catch((error) => {
                    console.error("Error uploading image:", error);
                });
        }
    };

    const handleProfileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Upload image to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "sudarshan_preset_upload"); // Use your Cloudinary preset here

            fetch("https://api.cloudinary.com/v1_1/dlgulcrz2/image/upload", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    const imageUrl = data.secure_url; // Get the secure 
                    console.log(imageUrl);
                    setProfileImage(imageUrl); // Update the state with the Cloudinary URL
                })
                .catch((error) => {
                    console.error("Error uploading image:", error);
                });
        }
    };

  

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a reference to the user's document in Firestore
        const userDocRef = doc(db, "users", currentUser.uid);

        try {
            // Update the user document with the new data
            await setDoc(userDocRef, {
                displayName: name,
                bio: bioText,
                photoURL: profileImage, // Store the URL of the profile image
                bg: backgroundImage, // Store the URL of the background image
            }, { merge: true });

            // Optionally, you can show a success message or navigate the user
            console.log("User profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    };

    return (
        <div className="profile-bio-container">
            <div className="bio-info">
                <span className="back-arrow" onClick={handleBack}>
                    <img src={Back_arrow} alt="Back" /> Edit Profile
                </span>

                <div className="profile-bio-bgImage-container">
                    <span className="profile-bg-image">
                        <img src={backgroundImage || DefaultBgImage} alt="Background" />
                    </span>
                </div>

                <div className="edit-bio-section">
                    <div className="profile-icon-section">
                        <div className="profile-image">
                            <img src={profileImage} alt="Profile" />
                            <span className="profile-edit-icon">
                                <img src={Edit_Icon} alt="Edit" onClick={profileUpdateHandler} />
                                <input
                                    type="file"
                                    ref={userProfileRef}
                                    style={{ display: 'none' }}
                                    onChange={handleProfileChange}
                                />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="profile-bg-edit-icon">
                    <img onClick={handleBgUpdate} src={Edit_Icon} alt="Edit background" />
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="user-bio-box">
                <form onSubmit={handleSubmit}>
                    <div className='input-section'>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio">Bio</label>
                            <input
                                id="bio"
                                value={bioText}
                                onChange={(e) => setBioText(e.target.value)}
                                placeholder="Tell us about yourself"
                                className="form-input"
                            />
                        </div>

                   </div>
                    <Buttons buttonType={"primaryButton"} buttonName="Save" />
                </form>
            </div>
        </div>
    );
};

export default EditProfile;