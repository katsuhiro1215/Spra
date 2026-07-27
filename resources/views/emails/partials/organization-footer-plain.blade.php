@php
    $organization = \App\Models\Organization::query()->first();
    $contactParts = [];
    if ($organization?->phone) {
        $contactParts[] = 'TEL: ' . $organization->phone;
    }
    if ($organization?->email) {
        $contactParts[] = 'Email: ' . $organization->email;
    }
@endphp
@if ($organization)
{{ $organization->name }}@if ($organization->representative_name) （代表: {{ $organization->representative_name }}） @endif

{{ implode(' / ', $contactParts) }}
@endif
