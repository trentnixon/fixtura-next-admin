"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetFormSchema, AssetFormValues } from "../schemas/assetFormSchema";
import { Asset, AssetContentType, AssetSport } from "@/types/asset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
    useAssetCategories,
} from "@/hooks/asset-categories/useAssetCategories";
import { useAssetTypes } from "@/hooks/asset-types/useAssetTypes";

interface AssetFormProps {
    asset?: Asset;
    onSubmit: (data: AssetFormValues) => void;
    isSubmitting?: boolean;
    onCancel?: () => void;
}

export function AssetForm({
    asset,
    onSubmit,
    isSubmitting = false,
    onCancel,
}: AssetFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<AssetFormValues>({
        resolver: zodResolver(assetFormSchema),
        defaultValues: asset
            ? {
                Name: asset.attributes.Name,
                CompositionID: asset.attributes.CompositionID,
                SubTitle: asset.attributes.SubTitle || "",
                Icon: asset.attributes.Icon || "",
                Sport: asset.attributes.Sport,
                ContentType: asset.attributes.ContentType,
                description: asset.attributes.description || "",
                Blurb: asset.attributes.Blurb || "",
                assetDescription: asset.attributes.assetDescription || "",
                filter: asset.attributes.filter || "",
                ArticleFormats: asset.attributes.ArticleFormats || "",
                asset_category: asset.attributes.asset_category?.data?.id,
                asset_type: asset.attributes.asset_type?.data?.id,
                subscription_package: asset.attributes.subscription_package?.data?.id,
                play_hq_end_point: asset.attributes.play_hq_end_point?.data?.id,
                account_types: asset.attributes.account_types?.data?.map((at) => at.id) || [],
            }
            : {
                Name: "",
                CompositionID: "",
                Sport: "Cricket",
                ContentType: "Single",
            },
    });

    const sportValue = watch("Sport");
    const contentTypeValue = watch("ContentType");
    const assetCategoryValue = watch("asset_category");
    const assetTypeValue = watch("asset_type");

    // Fetch relation data
    const { data: categoriesData, isLoading: categoriesLoading } = useAssetCategories({
        pageSize: 100,
        sort: "Name:asc"
    });
    const categories = categoriesData?.data;
    const { data: typesData, isLoading: typesLoading } = useAssetTypes({
        pageSize: 100, // Fetch more if needed
        sort: "Name:asc"
    });
    const types = typesData?.data;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="space-y-2">
                    <Label htmlFor="Name">
                        Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="Name" {...register("Name")} />
                    {errors.Name && (
                        <p className="text-sm text-red-500">{errors.Name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="CompositionID">
                        Composition ID <span className="text-red-500">*</span>
                    </Label>
                    <Input id="CompositionID" {...register("CompositionID")} />
                    {errors.CompositionID && (
                        <p className="text-sm text-red-500">{errors.CompositionID.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="SubTitle">Subtitle</Label>
                    <Input id="SubTitle" {...register("SubTitle")} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Icon">Icon URL</Label>
                    <Input id="Icon" {...register("Icon")} placeholder="https://..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Sport">
                        Sport <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={sportValue}
                        onValueChange={(value) => setValue("Sport", value as AssetSport)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a sport" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Cricket">Cricket</SelectItem>
                            <SelectItem value="AFL">AFL</SelectItem>
                            <SelectItem value="Hockey">Hockey</SelectItem>
                            <SelectItem value="Netball">Netball</SelectItem>
                            <SelectItem value="Basketball">Basketball</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.Sport && (
                        <p className="text-sm text-red-500">{errors.Sport.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ContentType">
                        Content Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={contentTypeValue}
                        onValueChange={(value) => setValue("ContentType", value as AssetContentType)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Collective">Collective</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.ContentType && (
                        <p className="text-sm text-red-500">{errors.ContentType.message}</p>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Content</h3>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        rows={3}
                        placeholder="Brief description..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Blurb">Blurb (Rich Text)</Label>
                    <Textarea
                        id="Blurb"
                        {...register("Blurb")}
                        rows={4}
                        placeholder="Marketing blurb..."
                    />
                    <p className="text-xs text-muted-foreground">
                        Note: Rich text editor to be implemented
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="assetDescription">Asset Description (Rich Text)</Label>
                    <Textarea
                        id="assetDescription"
                        {...register("assetDescription")}
                        rows={4}
                        placeholder="Detailed asset description..."
                    />
                    <p className="text-xs text-muted-foreground">
                        Note: Rich text editor to be implemented
                    </p>
                </div>
            </div>

            {/* Technical Details Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Technical Details</h3>

                <div className="space-y-2">
                    <Label htmlFor="filter">Filter</Label>
                    <Input id="filter" {...register("filter")} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ArticleFormats">Article Formats</Label>
                    <Input id="ArticleFormats" {...register("ArticleFormats")} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Metadata">Metadata (JSON)</Label>
                    <Textarea
                        id="Metadata"
                        {...register("Metadata")}
                        rows={4}
                        placeholder='{"key": "value"}'
                    />
                    <p className="text-xs text-muted-foreground">
                        Note: JSON editor to be implemented
                    </p>
                </div>
            </div>

            {/* Relations Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Relations</h3>

                <div className="space-y-2">
                    <Label htmlFor="asset_category">Asset Category</Label>
                    <Select
                        value={assetCategoryValue?.toString()}
                        onValueChange={(value) => setValue("asset_category", parseInt(value))}
                        disabled={categoriesLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select category"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {categories?.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.Name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="asset_type">Asset Type</Label>
                    <Select
                        value={assetTypeValue?.toString()}
                        onValueChange={(value) => setValue("asset_type", parseInt(value))}
                        disabled={typesLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={typesLoading ? "Loading..." : "Select type"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {types?.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.Name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <p className="text-sm text-muted-foreground">
                    Additional relation selectors (Subscription Package, PlayHQ Endpoint, Account Types) to be implemented.
                </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {asset ? "Update Asset" : "Create Asset"}
                </Button>
            </div>
        </form>
    );
}
