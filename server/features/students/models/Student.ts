import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
export class Student {
  @prop({
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [100, "Name must be less than 100 characters"],
  })
  name!: string;

  @prop({
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
  })
  email!: string;

  @prop({
    required: [true, "Age is required"],
    min: [1, "Age must be at least 1"],
    max: [120, "Age must be less than 120"],
  })
  age!: number;

  @prop({
    required: [true, "Address is required"],
    trim: true,
    minlength: [5, "Address must be at least 5 characters"],
    maxlength: [500, "Address must be less than 500 characters"],
  })
  address!: string;

  @prop({
    required: false,
    trim: true,
  })
  photo?: string;

  // Timestamps are automatically added by schemaOptions
  createdAt?: Date;
  updatedAt?: Date;
}

// Export the model
export const StudentModel = getModelForClass(Student);

// Default export for backward compatibility
export default StudentModel;
