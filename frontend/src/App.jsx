import { useEffect, useState } from "react";
import { supabase } from "../supaBaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import "./index.css";
import closedWardrobe from "./assets/closedwardrobe.png";
import openWardrobe from "./assets/openWardrobe.png";
import axios from "axios";

function App() {
  const [session, setSession] = useState(null);
  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [age, setAge] = useState(null);
  const [height, setHeight] = useState(null);
  const [skinTone, setSkinTone] = useState("");
  const [colorPreferences, setColorPreferences] = useState("");
  const [clothingSuggestions, setClothingSuggestions] = useState(null);
  const [styleProfile, setStyleProfile] = useState("");
  const [clothingRecommendations, setClothingRecommendations] = useState([]);
  const [stylingTips, setStylingTips] = useState([]);
  const [additionalAdvice, setAdditionalAdvice] = useState([]);
  const [accessories, setAccessories] = useState("");
  const [shoes, setShoes] = useState("");
  const [seasonalVariations, setSeasonalVariations] = useState([]);
  const [error, setError] = useState(null);
  const [remember, setRemember] = useState(
    "AI has crafted your personalized styles but once check it suits you..."
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleLoading = () => {
    setIsLoading(!isLoading);
  };

  const handleInputClick = () => {
    if (session) setIsFormVisible(true);
    else alert("Please login first");
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleLoginClick = () => {
    setIsAuthVisible(true);
  };

  const handleLogoutClick = () => {
    setIsAuthVisible(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    alert("Successfully Logged out");
  };

  function extractSections(rawText) {
    // Helper function to remove ** symbols
    function removeStars(text) {
      return text ? text.replace(/\*\*/g, "").trim() : null;
    }

    // Helper function to extract a section more flexibly
    function extractSection(sectionTitle) {
      const regex = new RegExp(
        `(?:^|\\n)(?:\\*{2})?(?:${sectionTitle}:?|\\d+\\.\\s*${sectionTitle})(?:\\*{2})?\\s*:?\\s*([\\s\\S]*?)(?=\\n\\*{2}|\\n\\d+\\.|$)`,
        "i"
      );
      const match = rawText.match(regex);
      return match ? removeStars(match[1]) : null;
    }

    // Helper function to parse content into an array based on bullet points
    function parseBulletPoints(sectionText) {
      if (!sectionText) return [];

      return sectionText
        .split("\n")
        .filter(
          (line) =>
            line.trim().startsWith("*") ||
            line.trim().startsWith("-") ||
            line.trim().startsWith("\t+")
        )
        .map((line) =>
          line
            .replace(/^[\*\-\t\+]+\s*/, "")
            .replace(/\*\*/g, "")
            .trim()
        );
    }

    // Extract "Accessories" and "Shoes" from the "Additional Advice" section
    function extractFromAdditionalAdvice(sectionName) {
      const sectionRegex = new RegExp(
        `\\*\\s*${sectionName}\\s*[:]?\\s*(.*?)(?=\\n\\*|$)`,
        "s"
      );
      const sectionMatch =
        extractSection("Additional Advice")?.match(sectionRegex);

      return sectionMatch
        ? sectionMatch[1]
            .split(/\n\*\s*/) // Split by newline and asterisk
            .filter((item) => item.trim() !== "") // Filter out empty items
            .map((item) => removeStars(item)) // Remove stars from each item
        : null;
    }

    // Extract individual sections with more flexible matching
    const styleProfile = removeStars(extractSection("Style Profile"));
    const clothingRecommendations = parseBulletPoints(
      extractSection("Clothing Recommendations")
    );
    const stylingTips = extractSection("Styling Tips")
      ?.split(/\n[\*\-]\s*/)
      .filter((tip) => tip.trim() !== "")
      .map((tip) => removeStars(tip.replace(/^\*\s*/, "")));

    const additionalAdvice = removeStars(extractSection("Additional Advice"));
    const accessories = extractFromAdditionalAdvice("Accessories");
    const shoes = extractFromAdditionalAdvice("Shoes");
    const seasonalVariations = parseBulletPoints(
      extractSection("Seasonal Variations")
    );

    // Extract "Remember" text at the end of the result
    const rememberText = rawText.match(/Remember[^"]*/is);
    const remember = removeStars(rememberText ? rememberText[0] : null);

    // Return an object containing all extracted sections, including "Remember"
    return {
      styleProfile,
      clothingRecommendations,
      stylingTips,
      additionalAdvice,
      accessories,
      shoes,
      seasonalVariations,
      remember,
    };
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Log input data for debugging
      console.log(age, height, skinTone, colorPreferences);

      // Send POST request to fetch clothing suggestions
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/get-clothing-suggestion`,
        {
          age: age,
          height: height,
          skin_tone: skinTone,
          color_preferences: colorPreferences,
        }
      );

      const rawResult = response.data.result;
      setClothingSuggestions(rawResult);

      // Extract sections from the raw result
      const extractedSections = extractSections(rawResult);

      // Update state with extracted data
      setStyleProfile(extractedSections.styleProfile);
      setClothingRecommendations(extractedSections.clothingRecommendations);
      setStylingTips(extractedSections.stylingTips);
      setAdditionalAdvice(extractedSections.additionalAdvice);

      // Update state for subsections under additional advice
      setAccessories(extractedSections.accessories);
      setShoes(extractedSections.shoes);
      setSeasonalVariations(extractedSections.seasonalVariations);
      setRemember(extractedSections.remember);

      console.log(extractedSections);
      console.log(response); // Log response for debugging
    } catch (error) {
      alert("Error fetching clothing suggestions. Please try again.");
      setError(error);
    }
    setIsFormVisible(false);
  };

  return (
    <div className="relative h-screen w-full">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://videos.pexels.com/video-files/2421545/2421545-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Content Below Video */}
      <div className="relative z-10">
        <div className="title flex justify-between items-center p-4">
          <h1 className="text-3xl font-extrabold text-white">Wardrobe</h1>
          <div className="flex gap-2">
            {!session ? (
              <button
                className="text-lg bg-green-400 rounded-lg px-3 py-2 cursor-pointer text-white"
                onClick={handleLoginClick}
              >
                Login
              </button>
            ) : (
              <button
                className="text-lg bg-green-400 rounded-lg px-3 py-2 cursor-pointer text-white"
                onClick={() => {
                  signOut();
                  handleLogoutClick();
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          {/* Background opacity change */}

          <div className="h-[649px] w-full flex justify-center items-center relative z-10">
            <div className="flex h-[500px] w-[500px]">
              <div className="relative">
                {/* Displaying Wardrobe Image */}
                {!clothingSuggestions ? (
                  <img
                    src={closedWardrobe}
                    className="max-h-full max-w-full object-contain cursor-pointer"
                    onClick={handleInputClick}
                  />
                ) : (
                  <img
                    src={openWardrobe}
                    className="max-h-full max-w-full object-contain relative z-0"
                  />
                )}

                {/* Displaying the Auth component centered on screen */}
                {isAuthVisible && (
                  <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50 z-30">
                    <div className="p-8 shadow-xl rounded-lg w-[500px]">
                      <div className="bg-white p-8 rounded-lg shadow-lg">
                        <Auth
                          supabaseClient={supabase}
                          appearance={{
                            theme: ThemeSupa,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form visibility */}
            {isFormVisible && (
              <div className="absolute z-30 p-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-xl rounded-lg w-[450px] transition-transform transform hover:scale-105">
                {/* Title */}
                <div className="text-center mb-6">
                  <h4 className="text-3xl font-extrabold text-white">
                    Wardrobe
                  </h4>
                </div>

                {/* Form */}
                <form onSubmit={submitHandler} className="space-y-6">
                  {/* Age Input */}
                  <div>
                    <h3 className="text-lg text-white font-medium mb-1 font-serif">
                      Age
                    </h3>
                    <input
                      type="number"
                      className="bg-white mb-4 rounded-lg px-4 py-2 w-full text-sm shadow-md focus:ring-2 focus:ring-yellow-400 outline-none transition-transform transform hover:scale-105"
                      placeholder="Enter your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>

                  {/* Height Input */}
                  <div>
                    <h3 className="text-lg text-white font-medium mb-1 font-serif">
                      Height
                    </h3>
                    <input
                      type="number"
                      className="bg-white mb-4 rounded-lg px-4 py-2 w-full text-sm shadow-md focus:ring-2 focus:ring-yellow-400 outline-none transition-transform transform hover:scale-105"
                      placeholder="Enter your height in cms"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>

                  {/* Skin Tone Input */}
                  <div>
                    <h3 className="text-lg text-white font-medium mb-1 font-serif">
                      Skin Tone
                    </h3>
                    <input
                      type="text"
                      className="bg-white mb-4 rounded-lg px-4 py-2 w-full text-sm shadow-md focus:ring-2 focus:ring-yellow-400 outline-none transition-transform transform hover:scale-105"
                      placeholder="Enter your skin tone"
                      value={skinTone}
                      onChange={(e) => setSkinTone(e.target.value)}
                    />
                  </div>

                  {/* Color Preferences Input */}
                  <div>
                    <h3 className="text-lg text-white font-medium mb-1 font-serif">
                      Color Preferences
                    </h3>
                    <input
                      type="text"
                      className="bg-white mb-6 rounded-lg px-4 py-2 w-full text-sm shadow-md focus:ring-2 focus:ring-yellow-400 outline-none transition-transform transform hover:scale-105"
                      placeholder="Enter your color preferences"
                      value={colorPreferences}
                      onChange={(e) => setColorPreferences(e.target.value)}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-2 text-white font-semibold bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 cursor-pointer relative"
                    onClick={handleLoading} // Trigger loading animation on button click
                  >
                    Give me Clothing Suggestions
                  </button>
                </form>

                {/* Close Button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 px-1 text-white text-4xl font-bold cursor-pointer"
                  onClick={handleCloseForm}
                >
                  &times;
                </button>

                {/* Loading Panel */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-opacity-50 rounded-lg flex justify-center items-center text-white transition-opacity ${
                    isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4 p-3">
                    <h4 className="text-4xl text-center font-extrabold text-white">
                      Wardrobe
                    </h4>
                    <span className="text-2xl font-extrabold animate-pulse">
                      AI is generating the best styles for you...
                    </span>
                    <div className="w-16 h-16 border-4 border-t-4 border-yellow-500 rounded-full animate-spin"></div>

                    {/* Additional loading text */}
                    <span className="text-xl animate-pulse">
                      Analyzing your preferences...
                    </span>
                    <span className="text-xl animate-pulse">
                      Selecting the perfect combinations...
                    </span>
                    <span className="text-xl animate-pulse">
                      Your personalized wardrobe is almost ready...
                    </span>
                    <span className="text-xl animate-pulse">
                      Finalizing your tailored suggestions...
                    </span>
                    <span className="text-xl animate-pulse">
                      We’re putting the finishing touches on it!
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-20">
          {clothingSuggestions && (
            <div className="flex justify-between">
              {/* Center the "Remember" text */}
              <div className="suggestion-container fixed top-5 left-1/2 transform -translate-x-1/2 p-3 bg-white opacity-70 shadow-md h-auto w-auto max-w-50 rounded-full ">
                <h3 className="text-xl text-center font-semibold">Remember</h3>
                <p className="text-gray-700 text-center text-sm mt-1">
                  {remember}
                </p>
              </div>

              {/* Top-Left Box */}
              <div className="suggestion-container fixed top-25 left-15 p-4 bg-white opacity-70 rounded-lg shadow-md w-140">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">Style Profile</h3>
                  <p className="text-gray-700 text-sm mt-2">{styleProfile}</p>
                </div>
              </div>

              {/* Top-Right Box */}
              <div className="suggestion-container fixed top-25 right-15 p-4 bg-white opacity-70 rounded-lg shadow-md w-140">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">
                    Clothing Recommendations
                  </h3>
                  {clothingRecommendations?.map((item, index) => (
                    <p key={index} className="text-gray-700 text-sm mt-2">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              {/* Bottom-Left Box */}
              <div className="suggestion-container fixed bottom-4 left-15 transform px-2 py-2 opacity-70 bg-white rounded-lg shadow-md w-140">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Additional Advice</h3>

                  {/* Accessories */}
                  <div className="mt-3">
                    <h4 className="text-md font-medium">Accessories</h4>
                    <p className="text-gray-700 text-sm mt-1">{accessories}</p>
                  </div>

                  {/* Shoes */}
                  <div className="mt-3">
                    <h4 className="text-md font-medium">Shoes</h4>
                    <p className="text-gray-700 text-sm mt-1">{shoes}</p>
                  </div>

                  {/* Seasonal Variations */}
                  <div className="mt-3">
                    <h4 className="text-md font-medium">Seasonal Variations</h4>
                    {seasonalVariations?.map((season, index) => (
                      <div key={index} className="mt-2">
                        <p className="text-sm font-semibold text-gray-700">
                          {season}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom-Right Box */}
              <div className="suggestion-container fixed bottom-4 right-15 p-4 bg-white opacity-70 rounded-lg shadow-md w-140">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">Styling Tips</h3>
                  {stylingTips?.map((tip, index) => (
                    <p key={index} className="text-gray-700 mt-2 text-sm">
                      {tip}
                    </p>
                  ))}
                </div>
              </div>

              {/* Bottom Button */}
              <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={() => {
                    setClothingSuggestions(null);
                    setIsFormVisible(true);
                    setIsLoading(false);
                  }}
                  className="cursor-pointer bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-xl p-3 rounded-2xl text-lg text-white font-bold"
                >
                  Want some different results?
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
