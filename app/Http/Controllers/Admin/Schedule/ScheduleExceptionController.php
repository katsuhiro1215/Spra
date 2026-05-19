<?php

namespace App\Http\Controllers\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScheduleExceptionRequest;
use App\Models\ScheduleException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleExceptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ScheduleExceptionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ScheduleException $scheduleException)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScheduleException $scheduleException)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ScheduleExceptionRequest $request, ScheduleException $scheduleException)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScheduleException $scheduleException)
    {
        //
    }
}
