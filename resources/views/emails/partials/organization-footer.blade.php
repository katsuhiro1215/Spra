@php $organization = \App\Models\Organization::query()->first(); @endphp
@if ($organization)
    <p>
        <strong>{{ $organization->name }}</strong>
        @if ($organization->representative_name)
            ／代表: {{ $organization->representative_name }}
        @endif
    </p>
    @if ($organization->phone || $organization->email)
        <p>
            @if ($organization->phone)
                TEL: {{ $organization->phone }}
            @endif
            @if ($organization->phone && $organization->email)
                ／
            @endif
            @if ($organization->email)
                Email: {{ $organization->email }}
            @endif
        </p>
    @endif
@endif
