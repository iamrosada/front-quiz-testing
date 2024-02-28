import React, { useState } from "react";
import axios from "axios";

interface QuizData {
  sectionName: string;
  description: string;
  imgURL: string;
  color: string;
  units: {
    unitName: string;
    description: string;
    color: string;
    levels: {
      title: string; // Novo campo para o título
      description: string; // Novo campo para a descrição
      conquest: number; // Novo campo para a conquista
      difficulty: "easy" | "medium" | "hard";
      quizes: {
        questionText: string;
        options: string[];
        correctOptionIndex: string;
      }[];
    }[];
  }[];
}

const CreateQuizForm: React.FC = () => {
  const [formData, setFormData] = useState<QuizData[]>([
    {
      sectionName: "",
      description: "",
      imgURL: "",
      color: "",
      units: [
        {
          unitName: "",
          color: "",
          description: "",
          levels: [
            {
              difficulty: "easy",
              title: "",
              description: "",
              conquest: 0,
              quizes: [
                {
                  questionText: "",
                  options: ["", "", "", ""],
                  correctOptionIndex: "",
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  const handleAddSection = () => {
    setFormData([
      ...formData,
      {
        sectionName: "",
        description: "",
        imgURL: "",
        color: "",
        units: [
          {
            unitName: "",
            color: "",
            description: "",
            levels: [
              {
                difficulty: "easy",
                title: "",
                description: "",
                conquest: 0,
                quizes: [
                  {
                    questionText: "",
                    options: ["", "", "", ""],
                    correctOptionIndex: "",
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  };

  const handleAddUnit = (sectionIndex: number) => {
    const newFormData = [...formData];
    newFormData[sectionIndex].units.push({
      unitName: "",
      color: "",
      description: "",
      levels: [
        {
          difficulty: "easy",
          title: "",
          description: "",
          conquest: 0,
          quizes: [
            {
              questionText: "",
              options: ["", "", "", ""],
              correctOptionIndex: "",
            },
          ],
        },
      ],
    });
    setFormData(newFormData);
  };

  const handleAddLevel = (sectionIndex: number, unitIndex: number) => {
    const newFormData = [...formData];
    newFormData[sectionIndex].units[unitIndex].levels.push({
      difficulty: "easy",
      title: "",
      description: "",
      conquest: 0,
      quizes: [
        { questionText: "", options: ["", "", "", ""], correctOptionIndex: "" },
      ],
    });
    setFormData(newFormData);
  };

  const handleAddQuestion = (
    sectionIndex: number,
    unitIndex: number,
    levelIndex: number
  ) => {
    const newFormData = [...formData];
    newFormData[sectionIndex].units[unitIndex].levels[levelIndex].quizes.push({
      questionText: "",
      options: ["", "", "", ""],
      correctOptionIndex: "",
    });
    setFormData(newFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    sectionIndex: number,
    unitIndex: number,
    levelIndex: number,
    questionIndex: number,
    field: string
  ) => {
    const { value } = e.target;
    const newFormData = [...formData] as any;
    if (field === "options") {
      newFormData[sectionIndex].units[unitIndex].levels[levelIndex].quizes[
        questionIndex
      ].options[e.target.dataset.optionindex as any] = value;
    } else {
      newFormData[sectionIndex].units[unitIndex].levels[levelIndex].quizes[
        questionIndex
      ][field] = value;
    }
    setFormData(newFormData);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64URL = reader.result as string;
        setFormData((prevState) => {
          const newState = [...prevState];
          newState[sectionIndex].imgURL = base64URL;
          return newState;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(JSON.stringify(formData, null, 2));
      await axios.post(
        "http://localhost:8080/v1/education/quiz/create",
        formData
      );
      // Perform any actions needed after data submission here
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-4">
      {formData.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className="border border-gray-300 rounded p-4 mb-4"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, sectionIndex)}
            className="border border-gray-300 rounded p-2 mb-2 mt-3"
          />
          {section.imgURL && (
            <img
              src={section.imgURL}
              alt="Preview"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          )}
          <input
            type="text"
            placeholder="Section Name"
            value={section.sectionName}
            onChange={(e) =>
              setFormData(
                formData.map((item, index) =>
                  index === sectionIndex
                    ? { ...item, sectionName: e.target.value }
                    : item
                )
              )
            }
            className="border border-gray-300 rounded p-2 mb-2 mt-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={section.description}
            onChange={(e) =>
              setFormData(
                formData.map((item, index) =>
                  index === sectionIndex
                    ? { ...item, description: e.target.value }
                    : item
                )
              )
            }
            className="border border-gray-300 rounded p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={section.imgURL}
            onChange={(e) =>
              setFormData(
                formData.map((item, index) =>
                  index === sectionIndex
                    ? { ...item, imgURL: e.target.value }
                    : item
                )
              )
            }
            className="border border-gray-300 rounded p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Color"
            value={section.color}
            onChange={(e) =>
              setFormData(
                formData.map((item, index) =>
                  index === sectionIndex
                    ? { ...item, color: e.target.value }
                    : item
                )
              )
            }
            className="border border-gray-300 rounded p-2 mb-2"
          />
          {section.units.map((unit: any, unitIndex: any) => (
            <div
              key={unitIndex}
              className="border border-gray-300 rounded p-4 mb-4"
            >
              <input
                type="text"
                placeholder="Unit Name"
                value={unit.unitName}
                onChange={(e) =>
                  setFormData(
                    formData.map((item, index) =>
                      index === sectionIndex
                        ? {
                            ...item,
                            units: item.units.map((u: any, i: any) =>
                              i === unitIndex
                                ? { ...u, unitName: e.target.value }
                                : u
                            ),
                          }
                        : item
                    )
                  )
                }
                className="border border-gray-300 rounded p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Unit Description"
                value={unit.description}
                onChange={(e) =>
                  setFormData(
                    formData.map((item, index) =>
                      index === sectionIndex
                        ? {
                            ...item,
                            units: item.units.map((u: any, i: any) =>
                              i === unitIndex
                                ? { ...u, description: e.target.value }
                                : u
                            ),
                          }
                        : item
                    )
                  )
                }
                className="border border-gray-300 rounded p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Unit Color"
                value={unit.color}
                onChange={(e) =>
                  setFormData(
                    formData.map((item, index) =>
                      index === sectionIndex
                        ? {
                            ...item,
                            units: item.units.map((u: any, i: any) =>
                              i === unitIndex
                                ? { ...u, color: e.target.value }
                                : u
                            ),
                          }
                        : item
                    )
                  )
                }
                className="border border-gray-300 rounded p-2 mb-2"
              />

              <select
                value={unit.difficulty}
                onChange={(e) =>
                  setFormData(
                    formData.map((item, index) =>
                      index === sectionIndex
                        ? {
                            ...item,
                            units: item.units.map((u: any, i: any) =>
                              i === unitIndex
                                ? { ...u, difficulty: e.target.value }
                                : u
                            ),
                          }
                        : item
                    )
                  )
                }
                className="border border-gray-300 rounded p-2 mb-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {unit.levels.map((level: any, levelIndex: any) => (
                <div
                  key={levelIndex}
                  className="border border-gray-300 rounded p-4 mb-4"
                >
                  <input
                    type="text"
                    placeholder="Level Title"
                    value={level.title}
                    onChange={(e) =>
                      setFormData(
                        formData.map((item, index) =>
                          index === sectionIndex
                            ? {
                                ...item,
                                units: item.units.map((u: any, i: any) =>
                                  i === unitIndex
                                    ? {
                                        ...u,
                                        levels: u.levels.map((l: any, j: any) =>
                                          j === levelIndex
                                            ? { ...l, title: e.target.value }
                                            : l
                                        ),
                                      }
                                    : u
                                ),
                              }
                            : item
                        )
                      )
                    }
                    className="border border-gray-300 rounded p-2 mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Level Description"
                    value={level.description}
                    onChange={(e) =>
                      setFormData(
                        formData.map((item, index) =>
                          index === sectionIndex
                            ? {
                                ...item,
                                units: item.units.map((u: any, i: any) =>
                                  i === unitIndex
                                    ? {
                                        ...u,
                                        levels: u.levels.map((l: any, j: any) =>
                                          j === levelIndex
                                            ? {
                                                ...l,
                                                description: e.target.value,
                                              }
                                            : l
                                        ),
                                      }
                                    : u
                                ),
                              }
                            : item
                        )
                      )
                    }
                    className="border border-gray-300 rounded p-2 mb-2"
                  />

                  <input
                    type="number"
                    placeholder="Conquest"
                    value={level.conquest}
                    onChange={(e) =>
                      setFormData(
                        formData.map((item, index) =>
                          index === sectionIndex
                            ? {
                                ...item,
                                units: item.units.map((u: any, i: any) =>
                                  i === unitIndex
                                    ? {
                                        ...u,
                                        levels: u.levels.map((l: any, j: any) =>
                                          j === levelIndex
                                            ? {
                                                ...l,
                                                conquest: parseInt(
                                                  e.target.value
                                                ),
                                              }
                                            : l
                                        ),
                                      }
                                    : u
                                ),
                              }
                            : item
                        )
                      )
                    }
                    className="border border-gray-300 rounded p-2 mb-2"
                  />
                  <select
                    value={level.difficulty}
                    onChange={(e) =>
                      setFormData(
                        formData.map((item, index) =>
                          index === sectionIndex
                            ? {
                                ...item,
                                units: item.units.map((u: any, i: any) =>
                                  i === unitIndex
                                    ? {
                                        ...u,
                                        levels: u.levels.map(
                                          (l: any, idx: any) =>
                                            idx === levelIndex
                                              ? {
                                                  ...l,
                                                  difficulty: e.target.value,
                                                }
                                              : l
                                        ),
                                      }
                                    : u
                                ),
                              }
                            : item
                        )
                      )
                    }
                    className="border border-gray-300 rounded p-2 mb-2"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  {level.quizes.map((quiz: any, quizIndex: any) => (
                    <div key={quizIndex} className="mb-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={quiz.questionText}
                        onChange={(e) =>
                          handleChange(
                            e,
                            sectionIndex,
                            unitIndex,
                            levelIndex,
                            quizIndex,
                            "questionText"
                          )
                        }
                        className="border border-gray-300 rounded p-2 mb-2"
                      />

                      {quiz.options &&
                        quiz.options.map(
                          (option: string, optionIndex: number) => (
                            <input
                              key={optionIndex}
                              type="text"
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  sectionIndex,
                                  unitIndex,
                                  levelIndex,
                                  quizIndex,
                                  "options"
                                )
                              }
                              className="border border-gray-300 rounded p-2 mb-2"
                              data-optionindex={optionIndex}
                            />
                          )
                        )}

                      <input
                        type="text"
                        placeholder="Correct Option Index"
                        value={quiz.correctOptionIndex}
                        onChange={(e) =>
                          handleChange(
                            e,
                            sectionIndex,
                            unitIndex,
                            levelIndex,
                            quizIndex,
                            "correctOptionIndex"
                          )
                        }
                        className="border border-gray-300 rounded p-2 mb-2"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      handleAddQuestion(sectionIndex, unitIndex, levelIndex)
                    }
                    className="bg-blue-500 text-white rounded px-4 py-2"
                  >
                    Add Question
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddLevel(sectionIndex, unitIndex)}
                className="bg-blue-500 text-white rounded px-4 py-2"
              >
                Add Level
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddUnit(sectionIndex)}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Add Unit
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddSection}
        className="bg-blue-500 text-white rounded px-4 py-2"
      >
        Add Section
      </button>
      <button
        type="submit"
        className="bg-green-500 text-white rounded px-4 py-2"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateQuizForm;

export interface SectionInfo {
  id: string;
  title: string;
  description: string;
  status: "concluded" | "inProgress" | "locked";
  imgURL?: string;
  totalProgress: number;
  progress: number;
  color: string;
}

export interface SectionUnitInfoNivel {
  id: string;
  title: string;
  status: "concluded" | "inProgress" | "locked";
  conquest: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface SectionUnitInfo {
  title: string;
  description: string;
  status: "concluded" | "inProgress" | "locked";
  color: string;
  nivels: SectionUnitInfoNivel[];
}

export interface SectionInfoUnits extends SectionInfo {
  units: SectionUnitInfo[];
}
