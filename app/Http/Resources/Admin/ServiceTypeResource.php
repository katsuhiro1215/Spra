<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceTypeResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   */
  public function toArray(Request $request): array
  {
    return [
      'id' => $this->id,
      'service_category_id' => $this->service_category_id,
      'name' => $this->name,
      'product_name' => $this->product_name,
      'version' => $this->version,
      'parent_service_id' => $this->parent_service_id,
      'slug' => $this->slug,
      'description' => $this->description,
      'detailed_description' => $this->detailed_description,
      'pricing_model' => $this->pricing_model,
      'pricing_model_label' => $this->pricing_model_label,
      'features' => $this->features ?? [],
      'target_audience' => $this->target_audience ?? [],
      'deliverables' => $this->deliverables ?? [],
      'technologies' => $this->technologies ?? [],
      'icon' => $this->icon,
      'color' => $this->color,
      'estimated_delivery_days' => $this->estimated_delivery_days,
      'estimated_delivery_label' => $this->estimated_delivery_label,
      'base_price' => $this->base_price,
      'formatted_price' => $this->formatted_price,
      'price_unit' => $this->price_unit,
      'sort_order' => $this->sort_order,
      'is_active' => $this->is_active,
      'is_featured' => $this->is_featured,
      'requires_consultation' => $this->requires_consultation,
      'consultation_note' => $this->consultation_note,
      'published_at' => $this->published_at?->format('Y-m-d\TH:i'),
      'display_name' => $this->display_name,
      'full_display_name' => $this->full_display_name,

      // リレーション
      'service_category' => $this->whenLoaded('serviceCategory', function () {
        return [
          'id' => $this->serviceCategory->id,
          'name' => $this->serviceCategory->name,
          'slug' => $this->serviceCategory->slug,
          'color' => $this->serviceCategory->color,
          'icon' => $this->serviceCategory->icon,
        ];
      }),

      'parent_service' => $this->whenLoaded('parentService', function () {
        return [
          'id' => $this->parentService->id,
          'name' => $this->parentService->name,
          'product_name' => $this->parentService->product_name,
          'version' => $this->parentService->version,
          'display_name' => $this->parentService->display_name,
        ];
      }),

      'child_services' => $this->whenLoaded('childServices', function () {
        return $this->childServices->map(function ($child) {
          return [
            'id' => $child->id,
            'name' => $child->name,
            'product_name' => $child->product_name,
            'version' => $child->version,
            'display_name' => $child->display_name,
            'is_active' => $child->is_active,
          ];
        });
      }),

      'created_by' => $this->whenLoaded('createdBy', function () {
        return [
          'id' => $this->createdBy->id,
          'name' => $this->createdBy->name,
        ];
      }),

      'updated_by' => $this->whenLoaded('updatedBy', function () {
        return $this->updatedBy ? [
          'id' => $this->updatedBy->id,
          'name' => $this->updatedBy->name,
        ] : null;
      }),

      // タイムスタンプ
      'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
      'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
      'created_at_human' => $this->created_at?->diffForHumans(),
      'updated_at_human' => $this->updated_at?->diffForHumans(),
    ];
  }
}
