import { PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { BaseEntityModel } from "shared";

export abstract class BaseEntity implements BaseEntityModel {
  @PrimaryKey({
    hidden: false,
    serializedName: "id",
  })
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
