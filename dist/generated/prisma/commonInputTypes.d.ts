import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums.js";
import type * as Prisma from "./internal/prismaNamespace.js";
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type EnumListingCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingCategory | Prisma.EnumListingCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel> | $Enums.ListingCategory;
};
export type DecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type EnumListingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | Prisma.EnumListingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingStatusFilter<$PrismaModel> | $Enums.ListingStatus;
};
export type EnumListingCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingCategory | Prisma.EnumListingCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ListingCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel>;
};
export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type EnumListingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | Prisma.EnumListingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ListingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumListingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumListingStatusFilter<$PrismaModel>;
};
export type EnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus;
};
export type EnumPickupMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PickupMethod | Prisma.EnumPickupMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PickupMethod[] | Prisma.ListEnumPickupMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PickupMethod[] | Prisma.ListEnumPickupMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPickupMethodFilter<$PrismaModel> | $Enums.PickupMethod;
};
export type EnumPayoutStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PayoutStatus | Prisma.EnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.PayoutStatus[] | Prisma.ListEnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.PayoutStatus[] | Prisma.ListEnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumPayoutStatusNullableFilter<$PrismaModel> | $Enums.PayoutStatus | null;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type EnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
};
export type EnumPickupMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PickupMethod | Prisma.EnumPickupMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PickupMethod[] | Prisma.ListEnumPickupMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PickupMethod[] | Prisma.ListEnumPickupMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPickupMethodWithAggregatesFilter<$PrismaModel> | $Enums.PickupMethod;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPickupMethodFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPickupMethodFilter<$PrismaModel>;
};
export type EnumPayoutStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayoutStatus | Prisma.EnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.PayoutStatus[] | Prisma.ListEnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.PayoutStatus[] | Prisma.ListEnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumPayoutStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.PayoutStatus | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPayoutStatusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPayoutStatusNullableFilter<$PrismaModel>;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type EnumCardBrandFilter<$PrismaModel = never> = {
    equals?: $Enums.CardBrand | Prisma.EnumCardBrandFieldRefInput<$PrismaModel>;
    in?: $Enums.CardBrand[] | Prisma.ListEnumCardBrandFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CardBrand[] | Prisma.ListEnumCardBrandFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCardBrandFilter<$PrismaModel> | $Enums.CardBrand;
};
export type EnumCardBrandWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CardBrand | Prisma.EnumCardBrandFieldRefInput<$PrismaModel>;
    in?: $Enums.CardBrand[] | Prisma.ListEnumCardBrandFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CardBrand[] | Prisma.ListEnumCardBrandFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCardBrandWithAggregatesFilter<$PrismaModel> | $Enums.CardBrand;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCardBrandFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCardBrandFilter<$PrismaModel>;
};
export type EnumDisputeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | Prisma.EnumDisputeStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.DisputeStatus[] | Prisma.ListEnumDisputeStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DisputeStatus[] | Prisma.ListEnumDisputeStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDisputeStatusFilter<$PrismaModel> | $Enums.DisputeStatus;
};
export type EnumDisputeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | Prisma.EnumDisputeStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.DisputeStatus[] | Prisma.ListEnumDisputeStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DisputeStatus[] | Prisma.ListEnumDisputeStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDisputeStatusWithAggregatesFilter<$PrismaModel> | $Enums.DisputeStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDisputeStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDisputeStatusFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumListingCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingCategory | Prisma.EnumListingCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel> | $Enums.ListingCategory;
};
export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type NestedEnumListingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | Prisma.EnumListingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingStatusFilter<$PrismaModel> | $Enums.ListingStatus;
};
export type NestedEnumListingCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingCategory | Prisma.EnumListingCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingCategory[] | Prisma.ListEnumListingCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ListingCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumListingCategoryFilter<$PrismaModel>;
};
export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type NestedEnumListingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListingStatus | Prisma.EnumListingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListingStatus[] | Prisma.ListEnumListingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ListingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumListingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumListingStatusFilter<$PrismaModel>;
};
export type NestedEnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus;
};
export type NestedEnumPickupMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PickupMethod | Prisma.EnumPickupMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PickupMethod[] | Prisma.ListEnumPickupMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PickupMethod[] | Prisma.ListEnumPickupMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPickupMethodFilter<$PrismaModel> | $Enums.PickupMethod;
};
export type NestedEnumPayoutStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PayoutStatus | Prisma.EnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.PayoutStatus[] | Prisma.ListEnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.PayoutStatus[] | Prisma.ListEnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumPayoutStatusNullableFilter<$PrismaModel> | $Enums.PayoutStatus | null;
};
export type NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
};
export type NestedEnumPickupMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PickupMethod | Prisma.EnumPickupMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PickupMethod[] | Prisma.ListEnumPickupMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PickupMethod[] | Prisma.ListEnumPickupMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPickupMethodWithAggregatesFilter<$PrismaModel> | $Enums.PickupMethod;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPickupMethodFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPickupMethodFilter<$PrismaModel>;
};
export type NestedEnumPayoutStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayoutStatus | Prisma.EnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    in?: $Enums.PayoutStatus[] | Prisma.ListEnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.PayoutStatus[] | Prisma.ListEnumPayoutStatusFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumPayoutStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.PayoutStatus | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPayoutStatusNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPayoutStatusNullableFilter<$PrismaModel>;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedEnumCardBrandFilter<$PrismaModel = never> = {
    equals?: $Enums.CardBrand | Prisma.EnumCardBrandFieldRefInput<$PrismaModel>;
    in?: $Enums.CardBrand[] | Prisma.ListEnumCardBrandFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CardBrand[] | Prisma.ListEnumCardBrandFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCardBrandFilter<$PrismaModel> | $Enums.CardBrand;
};
export type NestedEnumCardBrandWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CardBrand | Prisma.EnumCardBrandFieldRefInput<$PrismaModel>;
    in?: $Enums.CardBrand[] | Prisma.ListEnumCardBrandFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CardBrand[] | Prisma.ListEnumCardBrandFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCardBrandWithAggregatesFilter<$PrismaModel> | $Enums.CardBrand;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCardBrandFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCardBrandFilter<$PrismaModel>;
};
export type NestedEnumDisputeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | Prisma.EnumDisputeStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.DisputeStatus[] | Prisma.ListEnumDisputeStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DisputeStatus[] | Prisma.ListEnumDisputeStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDisputeStatusFilter<$PrismaModel> | $Enums.DisputeStatus;
};
export type NestedEnumDisputeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | Prisma.EnumDisputeStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.DisputeStatus[] | Prisma.ListEnumDisputeStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DisputeStatus[] | Prisma.ListEnumDisputeStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDisputeStatusWithAggregatesFilter<$PrismaModel> | $Enums.DisputeStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDisputeStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDisputeStatusFilter<$PrismaModel>;
};
