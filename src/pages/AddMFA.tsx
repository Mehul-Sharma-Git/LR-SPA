import React, { useState } from "react";
import { authService } from "../lib/auth";
import { useNavigate } from "react-router-dom";

const AddMFA: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [securityQuestions, setSecurityQuestions] = useState<
    { question: string; answer: string }[]
  >([{ question: "", answer: "" }]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!authService.getToken()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    setError("");
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhoneNumber(event.target.value);
  };

  const handleSecurityQuestionChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const newQuestions = [...securityQuestions];
    newQuestions[index][field] = value;
    setSecurityQuestions(newQuestions);
  };

  const addSecurityQuestion = () => {
    setSecurityQuestions([...securityQuestions, { question: "", answer: "" }]);
  };

  const handleSubmit = async () => {
    try {
      if (selectedOption === "sms") {
        if (!phoneNumber) {
          setError("Phone number is required for SMS OTP.");
          return;
        }
        await authService.addSMSOTP(phoneNumber);
      } else if (selectedOption === "securityQuestions") {
        if (securityQuestions.some((q) => !q.question || !q.answer)) {
          setError("All security questions and answers are required.");
          return;
        }
        const formattedQuestions = securityQuestions.map((q) => ({
          QuestionId: q.question,
          Answer: q.answer
        }));
        await authService.addSecurityQuestions(formattedQuestions);
      } else if (selectedOption === "googleAuthenticator") {
        await authService.addGoogleAuthenticator();
      } else {
        setError("Please select an MFA option.");
        return;
      }
      setError("");
      alert("MFA option added successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to add MFA option. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
      >
        Back to Dashboard
      </button>
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add MFA Authenticator
        </h1>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="mfaOption"
          >
            Select MFA Option
          </label>
          <select
            id="mfaOption"
            value={selectedOption}
            onChange={handleOptionChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>
              -- Select an option --
            </option>
            <option value="sms">📱 SMS OTP</option>
            <option value="securityQuestions">❓ Security Questions</option>
            <option value="googleAuthenticator">🔒 Google Authenticator</option>
          </select>
        </div>

        {selectedOption === "sms" && (
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}

        {selectedOption === "securityQuestions" && (
          <div className="mb-6">
            {securityQuestions.map((sq, index) => (
              <div key={index} className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor={`question-${index}`}
                >
                  Security Question {index + 1}
                </label>
                <input
                  id={`question-${index}`}
                  type="text"
                  value={sq.question}
                  onChange={(e) =>
                    handleSecurityQuestionChange(
                      index,
                      "question",
                      e.target.value
                    )
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor={`answer-${index}`}
                >
                  Answer
                </label>
                <input
                  id={`answer-${index}`}
                  type="text"
                  value={sq.answer}
                  onChange={(e) =>
                    handleSecurityQuestionChange(
                      index,
                      "answer",
                      e.target.value
                    )
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            ))}
            <button
              onClick={addSecurityQuestion}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Add Another Question
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Add MFA
        </button>
      </div>
    </div>
  );
};

export default AddMFA;
