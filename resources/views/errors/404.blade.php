@if(request()->is('admin') || request()->is('admin/*'))
    @include('errors.minimal', ['status' => 404, 'message' => 'お探しのページが見つかりませんでした。'])
@else
    @include('errors.public-404')
@endif
