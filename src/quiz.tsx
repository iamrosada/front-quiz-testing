import axios from "axios";
import React, { useState } from "react";

interface FormData {
  sectionName: string;
  units: {
    unitName: string;
    questions: {
      id: string;
      quiz: {
        questionText: string;
        options: string[];
        correctOptionIndex: string;
      }[];
    }[];
  }[];
}

const generateUniqueId = (): string => {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const uuidLength = 8;
  let shortUUID = "";
  for (let i = 0; i < uuidLength; i++) {
    const randomValue = Math.random();
    const character =
      randomValue < 0.5
        ? Math.floor(randomValue * 10).toString()
        : alphabet[Math.floor(randomValue * alphabet.length)];

    shortUUID += character;
  }

  return shortUUID;
};

const ComprehensiveForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    sectionName: "",
    units: [],
  });

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para criar a seção no backend ou realizar outras ações
    const { sectionName, units } = formData;
    const Quiz = {
      sections: {
        sectionName,
        units,
      },
    };
    console.log("Criar Seção:", Quiz);
    await axios.post("http://localhost:8080/v1/education/quiz/create", Quiz);

    // console.log(response.data);
  };

  const handleAddUnit = () => {
    setFormData((prevData) => ({
      ...prevData,
      units: [...prevData.units, { unitName: "", questions: [] }],
    }));
  };

  const handleAddQuestion = (unitIndex: number) => {
    setFormData((prevData) => {
      const updatedUnits = [...prevData.units];
      const newQuestionId = generateUniqueId();
      updatedUnits[unitIndex].questions.push({
        id: newQuestionId,
        quiz: [
          {
            questionText: "",
            options: [],
            correctOptionIndex: "",
          },
        ],
      });

      return { ...prevData, units: updatedUnits };
    });
  };

  return (
    <form className="p-4" onSubmit={handleCreateSection}>
      <div className="mb-4">
        <label
          htmlFor="sectionName"
          className="block text-sm font-medium text-gray-700"
        >
          Nome da Seção
        </label>

        <input
          type="text"
          id="sectionName"
          value={formData.sectionName}
          onChange={(e) => {
            setFormData({ ...formData, sectionName: e.target.value });
          }}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      {formData.units.map((unit, unitIndex) => (
        <div key={unitIndex} className="mb-4">
          <label
            htmlFor={`unitName${unitIndex}`}
            className="block text-sm font-medium text-gray-700"
          >
            Nome da Unidade
          </label>
          <input
            type="text"
            id={`unitName${unitIndex}`}
            value={unit.unitName}
            onChange={(e) =>
              setFormData((prevData) => {
                const updatedUnits = [...prevData.units];
                updatedUnits[unitIndex].unitName = e.target.value;
                return { ...prevData, units: updatedUnits };
              })
            }
            className="mt-1 p-2 border rounded-md w-full"
          />

          {/* Adicionar Pergunta para a Unidade */}
          <button
            type="button"
            onClick={() => handleAddQuestion(unitIndex)}
            className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 mt-1"
          >
            Adicionar Pergunta
          </button>

          {unit.questions.map((question, questionIndex) => (
            <QuestionForm
              key={questionIndex}
              unitIndex={unitIndex}
              questionIndex={questionIndex}
              questionData={question}
              setFormData={setFormData}
            />
          ))}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddUnit}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Adicionar Unidade
      </button>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
      >
        Criar Seção
      </button>
    </form>
  );
};

interface QuestionFormProps {
  unitIndex: number;
  questionIndex: number;
  questionData: {
    id: string;
    quiz: {
      questionText: string;
      options: string[];
      correctOptionIndex: string;
    }[];
  };
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  unitIndex,
  questionIndex,
  questionData,
  setFormData,
}) => {
  const { id, quiz } = questionData;

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData((prevData) => {
      const updatedUnits = [...prevData.units];
      updatedUnits[unitIndex].questions[questionIndex] = {
        id: id,
        quiz: quiz.map((question) => ({
          questionText: question.questionText || "",
          options: question.options,
          correctOptionIndex: question.correctOptionIndex,
        })),
      };
      return { ...prevData, units: updatedUnits };
    });
  };

  const handleAddOption = () => {
    setFormData((prevData) => {
      const updatedUnits = [...prevData.units];
      const updatedQuestions = [...updatedUnits[unitIndex].questions];

      updatedQuestions[questionIndex].quiz.forEach((question) => {
        question.options = [...question.options, ""];
      });

      updatedUnits[unitIndex].questions = updatedQuestions;
      return { ...prevData, units: updatedUnits };
    });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    setFormData((prevData) => {
      const updatedUnits = [...prevData.units];
      const updatedQuestions = [...updatedUnits[unitIndex].questions];

      updatedQuestions[questionIndex].quiz.forEach((question) => {
        question.options[optionIndex] = value;
      });

      updatedUnits[unitIndex].questions = updatedQuestions;
      return { ...prevData, units: updatedUnits };
    });
  };

  const handleQuestionTextChange = (value: string) => {
    setFormData((prevData) => {
      const updatedUnits = [...prevData.units];
      updatedUnits[unitIndex].questions[questionIndex].quiz[0].questionText =
        value;
      return { ...prevData, units: updatedUnits };
    });
  };

  const handleCorrectOptionIndexChange = (value: string) => {
    // Parse the input value as an integer
    const intValue = parseInt(value, 10);

    // Check if the parsed value is not negative before updating the state
    if (!isNaN(intValue) && intValue >= 0) {
      setFormData((prevData) => {
        const updatedUnits = [...prevData.units];
        updatedUnits[unitIndex].questions[
          questionIndex
        ].quiz[0].correctOptionIndex = intValue.toString();
        return { ...prevData, units: updatedUnits };
      });
    }
  };

  return (
    <form
      className="p-4 border border-gray-300 rounded-md mb-4"
      onSubmit={handleCreateQuestion}
    >
      <div className="mb-4">
        <label
          htmlFor={`questionText${unitIndex}-${questionIndex}`}
          className="block text-sm font-medium text-gray-700"
        >
          Texto da Pergunta
        </label>
        <textarea
          id={`questionText${unitIndex}-${questionIndex}`}
          rows={4}
          value={quiz[0].questionText}
          onChange={(e) => handleQuestionTextChange(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor={`options${unitIndex}-${questionIndex}`}
          className="block text-sm font-medium text-gray-700"
        >
          Opções (separadas por vírgula)
        </label>
        {quiz[0].options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
        ))}
        <button
          type="button"
          onClick={handleAddOption}
          className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Adicionar Opção
        </button>
      </div>

      <div className="mb-4">
        <label
          htmlFor={`correctOptionIndex${unitIndex}-${questionIndex}`}
          className="block text-sm font-medium text-gray-700"
        >
          Índice da Opção Correta
        </label>
        <input
          type="number"
          id={`correctOptionIndex${unitIndex}-${questionIndex}`}
          value={quiz[0].correctOptionIndex}
          onChange={(e) => handleCorrectOptionIndexChange(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Criar Pergunta
      </button>
    </form>
  );
};

export default ComprehensiveForm;
