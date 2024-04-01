import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Row,
  Col,
  Label,
  Input,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { Breadcrumbs } from "../../../AbstractElements";
import Select from "react-select";
import BookAdding from "./Components/BookAdding";
import { IoIosAddCircle, IoMdClose } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { UpdateBookLocation, addBook } from "../../../api_handler/addbookapi";
import { toast } from "react-toastify";
import {
  departmentInfo,
  languageList,
  programList,
  programYear,
  subjectList,
  vendorList,
} from "../../../api_handler/collegeInfo";
import { branchID, userId, userType } from "../../../Constant";
import { GetAllBookCategories } from "../../../api_handler/bookcategory";
import { GetAllBookLocation } from "../../../api_handler/booklocation";

export default function AddBook() {
  const location = useLocation();
  const { bookDetails } = location.state || {};
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();
  console.log("first", bookDetails);

  const [resetFlag, setResetFlag] = useState(false);
  const [books, setBooks] = useState([bookDetails || {}]);
  const [block, setBlock] = useState([]);
  const [mode, setMode] = useState("add");
  const [department, setDepartment] = useState([]);
  const [programYearData, setProgramYear] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [programListData, setProgramList] = useState([]);
  const [bookCategory, setBookCategory] = useState([]);
  const [allsubjectList, setAllSubjectList] = useState([]);
  const [Language, setLanguage] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await GetAllBookLocation();
        const ProgramList = await programList();
        const DeparmentList = await departmentInfo();
        const ProgramYearList = await programYear();
        const VendorList = await vendorList();
        const bCategory = await GetAllBookCategories();
        const sList = await subjectList();
        const lang = await languageList();

        setBlock(response.location);
        setDepartment(
          DeparmentList.departments?.map((item) => ({
            value: item.class_name,
            label: item.class_name,
          })) || []
        );
        setProgramYear(
          ProgramYearList.program_years?.map((item) => ({
            value: item.id,
            label: `${item.course_year}/${item.semester}`,
          })) || []
        );
        setVendor(VendorList.vendors);
        setProgramList(ProgramList.programs);
        setBookCategory(bCategory.categories);
        setAllSubjectList(sList.subjects);
        setLanguage(lang.languages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (location.pathname === `/${userType}/${branchID}/edit-book`) {
      setMode("edit");
    }
  }, [location.pathname]);

  const onSubmit = (data) => {
    console.log("b4 submit", data);
    data.books.map((item) => {
      if (bookDetails) {
        console.log("update", bookDetails.id);
        UpdateBookLocation(
          item.title,
          item.bookLocation,
          item.categoryName,
          item.author,
          item.publisher,
          item.vendor,
          item.isbnCode,
          item.publicationYear,
          item.program,
          JSON.stringify(item.dept),
          JSON.stringify(item.programYear),
          item.volume,
          item.pages,
          item.subject,
          item.languages,
          item.edition,
          item.material,
          item.subMaterial,
          item.classNo,
          item.publicationYear,
          item.pageNo,
          item.publicationPlace,
          item.Accession,
          item.entryDate,
          item.financialYear,
          bookDetails.id
        ).then((res) => {
          console.log(res);
          if (res.status === "success") {
            toast.success(res.message);
            window.location.replace(`/lms/${userType}/${userId}/view-books`);
            console.log("updated data:", data);
          } else if (res.status === "error") {
            toast.error(res.message);
          }
        });
      } else {
        addBook(
          item.title,
          item.bookLocation,
          item.categoryName,
          item.author,
          item.publisher,
          item.vendor,
          item.isbnCode,
          item.publicationYear,
          item.program,
          item.dept,
          item.programYear,
          item.volume,
          item.pages,
          item.subject,
          item.languages,
          item.edition,
          item.material,
          item.subMaterial,
          item.classNo,
          item.publicationYear,
          item.pageNo,
          item.publicationPlace,
          item.Accession,
          item.entryDate,
          item.financialYear
        ).then((res) => {
          console.log(res);
          if (res.status === "success") {
            toast.success(res.message);
            window.location.replace(`/lms/${userType}/${userId}/view-books`);
            console.log("Submitted data:", data);
          } else if (res.status === "error") {
            toast.error(res.message);
          }
        });
      }
    });
  };

  const handleAddBook = async () => {
    const isValid = await trigger(); // Trigger validation for all fields
    if (isValid) {
      setBooks([...books, {}]); // Add a new empty book object if all fields are valid
    } // Add a new empty book object
    console.log("hello");
  };

  const handleRemoveBook = (index) => {
    setBooks(books.filter((_, i) => i !== index)); // Remove book at specified index
  };

  useEffect(() => {
    if (bookDetails) {
      console.log("book_author", bookDetails.book_author);
      setValue("book_author", bookDetails.book_author || "");
      setValue("book_location", bookDetails.book_location || "");
      setValue("book_category", bookDetails.book_category || "");
      setValue("book_class_no", bookDetails.book_class_no || "");
      setValue("book_edition", bookDetails.book_edition || "");
      // setValue("date_of_entry", bookDetails.date_of_entry || "");
      setValue("financial_year", bookDetails.financial_year || "");
      setValue("book_isbn_code", bookDetails.book_isbn_code || "");
      setValue("language", bookDetails.language || "");
      setValue("book_material_type", bookDetails.book_material_type || "");
      setValue("book_page_no", bookDetails.book_page_no || "");
      setValue("pages", bookDetails.pages || "");
      setValue("program", bookDetails.program || "");
      setValue("program_year", bookDetails.program_year || "");
      setValue(
        "book_place_publication",
        bookDetails.book_place_publication || ""
      );
      setValue(
        "book_year_of_publication",
        bookDetails.book_year_of_publication || ""
      );
      // setValue("published_year", bookDetails.published_year || "");
      setValue("book_publisher", bookDetails.book_publisher || "");
      setValue(
        "book_sub_material_type",
        bookDetails.book_sub_material_type || ""
      );
      setValue("book_name", bookDetails.book_name || "");
      setValue("book_vendor", bookDetails.book_vendor || "");
      setValue("book_volume", bookDetails.book_volume || "");
      setValue("subject", bookDetails.subject || "");
    }
  }, [bookDetails, setValue]);

  useEffect(() => {
    // Set initial values for input fields based on each book object
    if (books.length > 0) {
      books.forEach((book, index) => {
        Object.keys(book).forEach((key) => {
          setValue(`books[${index}].${key}`, book[key]);
        });
      });
    }
  }, [books, setValue]);

  const handleCancel = () => {
    setResetFlag(true);
    setTimeout(() => {
      setResetFlag(false);
      setValue("author", "");
      setValue("blockName", "");
      setValue("categoryName", "");
      setValue("classNo", "");
      setValue("dept", "");
      setValue("edition", "");
      setValue("entryDate", "");
      setValue("financialYear", "");
      setValue("isbnCode", "");
      setValue("languages", "");
      setValue("material", "");
      setValue("pageNo", "");
      setValue("pages", "");
      setValue("program", "");
      setValue("programYear", "");
      setValue("publicationPlace", "");
      setValue("publicationYear", "");
      setValue("publishDate", "");
      setValue("publisher", "");
      setValue("subMaterial", "");
      setValue("title", "");
      setValue("vendor", "");
      setValue("volume", "");
      setValue("material", "");
      setValue("subject", "");
      setValue("Accession", "");
    }, 0);
  };
  return (
    <Fragment>
      <Breadcrumbs
        parent={mode === "add" ? "Add Book" : "Edit Book"}
        mainTitle={mode === "add" ? "Add Book" : "Edit Book"}
        title={mode === "add" ? "Add New Book" : "Edit Book Details"}
      />
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            {books.map((book, index) => (
              <FormGroup key={index}>
                <Col
                  md={12}
                  className="d-flex justify-content-end text-danger"
                  style={{ fontSize: "2rem" }}
                >
                  {index !== 0 && ( // Exclude the first form group
                    <MdCancel onClick={() => handleRemoveBook(index)} />
                  )}
                </Col>
                <Row className="p-2">
                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Book Location
                    </Label>
                    <Controller
                      name={`books[${index}].bookLocation`}
                      control={control}
                      defaultValue={book.book_location || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <select {...field} className="form-control">
                            <option value="">Select Book Location</option>
                            {/* <option>Select block</option> */}
                            {block.map((b) => (
                              <option key={b.id} value={b.block}>
                                {b.block}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.bookLocation?.type ===
                      "required" && (
                      <p className="text-danger">Book location is required</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Book Category
                    </Label>
                    <Controller
                      name={`books[${index}].categoryName`}
                      control={control}
                      defaultValue={book.book_category || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <select {...field} className="form-control">
                            <option value="">Select Book Category</option>
                            {bookCategory.map((b) => (
                              <option key={b.id} value={b.category_name}>
                                {b.category_name}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.categoryName?.type ===
                      "required" && (
                      <p className="text-danger">Book category is required</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Book Title
                    </Label>
                    <Controller
                      name={`books[${index}].title`}
                      control={control}
                      defaultValue={book.book_name || ""}
                      rules={{
                        required: true,
                        maxLength: 20,
                        pattern: /^[A-Za-z0-9. ]+$/i,
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            className="form-control"
                            maxLength={20}
                          />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.title?.type === "required" && (
                      <p className="text-danger">Book title is required</p>
                    )}
                    {errors?.books?.[index]?.title?.type === "maxLength" && (
                      <p className="text-danger">
                        Book Title should be maximum 20 characters
                      </p>
                    )}
                    {errors?.books?.[index]?.title?.type === "pattern" && (
                      <p className="text-danger">Alphabets and numbers only</p>
                    )}
                  </Col>
                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Author
                    </Label>
                    <Controller
                      name={`books[${index}].author`}
                      control={control}
                      defaultValue={book.book_author || ""}
                      rules={{
                        required: true,
                        maxLength: 10,
                        pattern: /^[A-Za-z. ]+$/i,
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            className="form-control"
                            maxLength={20}
                          />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.author?.type === "required" && (
                      <p className="text-danger">Author name is required</p>
                    )}
                    {errors?.books?.[index]?.author?.type === "maxLength" && (
                      <p className="text-danger">
                        Author name should be maximum 20 characters
                      </p>
                    )}
                    {errors?.books?.[index]?.author?.type === "pattern" && (
                      <p className="text-danger">
                        Alphabetical and dot characters only
                      </p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Publisher
                    </Label>
                    <Controller
                      name={`books[${index}].publisher`}
                      control={control}
                      defaultValue={book.book_publisher || ""}
                      rules={{
                        required: true,
                        maxLength: 20,
                        pattern: /^[A-Za-z. ]+$/i,
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            className="form-control"
                            maxLength={20}
                          />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.publisher?.type === "required" && (
                      <p className="text-danger">Publisher name is required</p>
                    )}
                    {errors?.books?.[index]?.publisher?.type ===
                      "maxLength" && (
                      <p className="text-danger">
                        Publisher name should be maximum 20 characters
                      </p>
                    )}
                    {errors?.books?.[index]?.publisher?.type === "pattern" && (
                      <p className="text-danger">
                        Alphabetical and dot characters only
                      </p>
                    )}
                  </Col>
                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Vendor
                    </Label>
                    <Controller
                      name={`books[${index}].vendor`}
                      control={control}
                      defaultValue={book.book_vendor || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <select {...field} className="form-control">
                            <option value="">Select Vendor</option>
                            {vendor.map((v) => (
                              <option key={v.id} value={v.vendor_name}>
                                {v.vendor_name}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.vendor?.type === "required" && (
                      <p className="text-danger">Vendor name is required</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Program
                    </Label>
                    <Controller
                      name={`books[${index}].program`}
                      control={control}
                      defaultValue={book.program || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <select {...field} className="form-control">
                            <option value="">Select Program</option>
                            {programListData.map((p) => (
                              <option key={p.course_id} value={p.course_type}>
                                {p.course_type}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.program?.type === "required" && (
                      <p className="text-danger">Program name is required</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      dept
                    </Label>
                    <Controller
                      name={`books[${index}].dept`}
                      control={control}
                      defaultValue={book.department || []}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <Select {...field} isMulti options={department} />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.dept?.type === "required" && (
                      <p className="text-danger">
                        At least one dept is required
                      </p>
                    )}
                  </Col>
                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Program Year
                    </Label>
                    <Controller
                      name={`books[${index}].programYear`}
                      control={control}
                      defaultValue={book.program_year || []}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <Select
                            {...field}
                            isMulti
                            options={programYearData}
                          />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.programYear?.type ===
                      "required" && (
                      <p className="text-danger">
                        At least one program year is required
                      </p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Book ISBN Code
                    </Label>
                    <Controller
                      name={`books[${index}].isbnCode`}
                      control={control}
                      defaultValue={book.book_isbn_code || ""}
                      rules={{
                        required: true,
                        maxLength: 20,
                      }}
                      render={({ field }) => (
                        <>
                          <input {...field} className="form-control" />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.isbnCode?.type === "required" && (
                      <p className="text-danger">Book ISBN code is required</p>
                    )}
                  </Col>
                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Volume
                    </Label>
                    <Controller
                      name={`books[${index}].volume`}
                      control={control}
                      defaultValue={book.book_volume || ""}
                      rules={{
                        required: true,
                        maxLength: 20,
                        pattern: /^[A-Za-z0-9. ]+$/i,
                      }}
                      render={({ field }) => (
                        <>
                          <input {...field} className="form-control" />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.volume?.type === "required" && (
                      <p className="text-danger">Book volume is required</p>
                    )}
                    {errors?.books?.[index]?.volume?.type === "maxLength" && (
                      <p className="text-danger">
                        Book Title should be maximum 20 characters
                      </p>
                    )}
                    {errors?.books?.[index]?.volume?.type === "pattern" && (
                      <p className="text-danger">Alphabets and numbers only</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Number of Pages
                    </Label>
                    <Controller
                      name={`books[${index}].pages`}
                      control={control}
                      defaultValue={book.book_page_no || ""}
                      rules={{
                        required: true,
                        maxLength: 20,
                        pattern: /^[0-9]+$/,
                      }}
                      render={({ field }) => (
                        <>
                          <input {...field} className="form-control" />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.pages?.type === "required" && (
                      <p className="text-danger">No of pages is required</p>
                    )}
                    {errors?.books?.[index]?.pages?.type === "pattern" && (
                      <p className="text-danger">Numbers Only</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Languages
                    </Label>
                    <Controller
                      name={`books[${index}].languages`}
                      control={control}
                      defaultValue={book.language || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <select {...field} className="form-control">
                            <option value="">Select Language</option>
                            {Language.map((l) => (
                              <option key={l.id} value={l.language_name}>
                                {l.language_name}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.languages?.type === "required" && (
                      <p className="text-danger">Language is required</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Book Edition
                    </Label>
                    <Controller
                      name={`books[${index}].edition`}
                      control={control}
                      defaultValue={book.book_edition}
                      rules={{
                        required: true,
                        maxLength: 20,
                        pattern: /^[A-Za-z0-9. ]+$/i,
                      }}
                      render={({ field }) => (
                        <>
                          <input {...field} className="form-control" />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.edition?.type === "required" && (
                      <p className="text-danger">Book edition is required</p>
                    )}
                    {errors?.books?.[index]?.pages?.type === "maxLength" && (
                      <p className="text-danger">
                        Edition should be maximum 20 characters
                      </p>
                    )}
                    {errors?.books?.[index]?.pages?.type === "pattern" && (
                      <p className="text-danger">Alphabets and numbers only</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Material Type
                    </Label>
                    <Controller
                      name={`books[${index}].material`}
                      control={control}
                      defaultValue={book.book_material_type}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <select {...field} className="form-control">
                            <option value="">Select Material Type</option>
                            <option value="book">Book</option>
                            <option value="non-book">Non Book</option>
                          </select>
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.material?.type === "required" && (
                      <p className="text-danger">Material type is required</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Sub Material Type
                    </Label>
                    <Controller
                      name={`books[${index}].subMaterial`}
                      control={control}
                      defaultValue={book.book_sub_material_type}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <select {...field} className="form-control">
                            <option value="">Select Sub Material Type</option>
                            <option value="Ebook">Ebook</option>
                            <option value="Text">Text</option>
                            <option value="Cbb">CBB</option>
                            <option value="Paperback">Paperback</option>
                            <option value="Spiral">Spiral</option>
                            <option value="Hardcover">Hardcover</option>
                          </select>
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.subMaterial?.type ===
                      "required" && (
                      <p className="text-danger">
                        Sub material type is required
                      </p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Class No
                    </Label>
                    <Controller
                      name={`books[${index}].classNo`}
                      defaultValue={book.book_class_no}
                      control={control}
                      rules={{
                        required: true,
                        maxLength: 20,
                        pattern: /^[A-Za-z0-9. !@#$%^&*()_-]+$/i,
                      }}
                      render={({ field }) => (
                        <>
                          <input {...field} className="form-control" />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.classNo?.type === "required" && (
                      <p className="text-danger">Class no. is required</p>
                    )}
                    {errors?.books?.[index]?.classNo?.type === "maxLength" && (
                      <p className="text-danger">
                        Class no. should be maximum 20 characters
                      </p>
                    )}
                    {errors?.books?.[index]?.classNo?.type === "pattern" && (
                      <p className="text-danger">
                        Alphabets, numbers, and symbols only
                      </p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Year of Publication
                    </Label>
                    <Controller
                      name={`books[${index}].publicationYear`}
                      control={control}
                      defaultValue={book.book_year_of_publication}
                      rules={{
                        required: true,
                        maxLength: 10,
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            className="form-control"
                            type="date"
                            max={new Date().toISOString().split("T")[0]} // Disables future dates
                          />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.publicationYear?.type ===
                      "required" && (
                      <p className="text-danger">Publish Date is required</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Page No
                    </Label>
                    <Controller
                      name={`books[${index}].pageNo`}
                      defaultValue={book.book_page_no}
                      control={control}
                      rules={{
                        required: true,
                        maxLength: 20,
                        pattern: /^[A-Za-z0-9. !@#$%^&*()_-]+$/i,
                      }}
                      render={({ field }) => (
                        <>
                          <input {...field} className="form-control" />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.pageNo?.type === "required" && (
                      <p className="text-danger">Page no. is required</p>
                    )}
                    {errors?.books?.[index]?.pageNo?.type === "maxLength" && (
                      <p className="text-danger">
                        Page no. should be maximum 20 characters
                      </p>
                    )}
                    {errors?.books?.[index]?.pageNo?.type === "pattern" && (
                      <p className="text-danger">
                        Alphabets, numbers, and symbols only
                      </p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Place of Publication
                    </Label>
                    <Controller
                      name={`books[${index}].publicationPlace`}
                      control={control}
                      defaultValue={book.book_place_publication}
                      rules={{
                        required: true,
                        maxLength: 20,
                        pattern: /^[A-Za-z. ]+$/i,
                      }}
                      render={({ field }) => (
                        <>
                          <input {...field} className="form-control" />
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.publicationPlace?.type ===
                      "required" && (
                      <p className="text-danger">
                        Place of publication is required
                      </p>
                    )}
                    {errors?.books?.[index]?.publicationPlace?.type ===
                      "maxLength" && (
                      <p className="text-danger">
                        Place of publication should be maximum 20 characters
                      </p>
                    )}
                    {errors?.books?.[index]?.publicationPlace?.type ===
                      "pattern" && (
                      <p className="text-danger">Alphabets only</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Accession Register
                    </Label>
                    <Controller
                      name={`books[${index}].Accession`}
                      control={control}
                      defaultValue={book.book_accession_register}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <select {...field} className="form-control">
                            <option value="">Select Accession Register</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.Accession?.type === "required" && (
                      <p className="text-danger">
                        Accession register is required
                      </p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Financial Year
                    </Label>
                    <Controller
                      name={`books[${index}].financialYear`}
                      control={control}
                      defaultValue={book.financial_year}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <select {...field} className="form-control">
                            <option value="">Select Financial Year</option>
                            <option value="2022-2023">2022-2023</option>
                            <option value="2023-2024">2023-2024</option>
                          </select>
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.financialYear?.type ===
                      "required" && (
                      <p className="text-danger">Financial year is required</p>
                    )}
                  </Col>

                  <Col md={6}>
                    <Label
                      className="font-size font-weight-bold"
                      style={{ fontWeight: "bold" }}
                    >
                      Subject
                    </Label>
                    <Controller
                      name={`books[${index}].subject`}
                      control={control}
                      defaultValue={book.subject}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <select {...field} className="form-control">
                            <option value="">Select Subject</option>
                            {allsubjectList.map((s) => (
                              <option key={s.id} value={s.subject_code}>
                                {s.subject}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    />
                    {errors?.books?.[index]?.subject?.type === "required" && (
                      <p className="text-danger">Subject is required</p>
                    )}
                  </Col>
                </Row>
              </FormGroup>
            ))}
            <div className="d-flex justify-content-between">
              <div>
                <Button
                  type="submit"
                  color="success"
                  className="mt-2 ml-3 btn-success mr-2"
                >
                  Save
                </Button>{" "}
                <Button
                  type="button"
                  color="danger"
                  onClick={handleCancel}
                  className="mt-2 ml-3 btn-danger"
                >
                  Cancel
                </Button>
              </div>
              {mode === "add" && (
                <IoIosAddCircle
                  color="success"
                  className="text-success"
                  style={{ fontSize: "3rem" }}
                  onClick={handleAddBook}
                />
              )}
            </div>
          </form>
        </CardBody>
      </Card>
    </Fragment>
  );
}
