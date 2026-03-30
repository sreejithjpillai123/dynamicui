<?php

namespace App\Http\Controllers;

use App\Models\UiBlock;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UiBlockController extends Controller
{
    // ── Helper: add CORS headers ──────────────────────────
    private function cors(JsonResponse $response): JsonResponse
    {
        return $response
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    }

    // ── ADMIN: list all blocks ────────────────────────────
    public function adminIndex(): JsonResponse
    {
        $blocks = UiBlock::orderBy('order')->get();
        return $this->cors(response()->json(['data' => $blocks]));
    }

    // ── CLIENT: list only active blocks ──────────────────
    public function clientIndex(): JsonResponse
    {
        $blocks = UiBlock::where('status', 'active')->orderBy('order')->get();
        return $this->cors(response()->json(['data' => $blocks]));
    }

    // ── ADMIN: create a new block ─────────────────────────
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'type'    => 'required|in:banner,card,list,stats',
            'status'  => 'sometimes|in:active,inactive',
            'content' => 'sometimes|array',
        ]);

        // Auto-assign next order
        $maxOrder = UiBlock::max('order') ?? 0;

        $block = UiBlock::create([
            'title'   => $validated['title'],
            'type'    => $validated['type'],
            'status'  => $validated['status'] ?? 'active',
            'order'   => $maxOrder + 1,
            'content' => $validated['content'] ?? UiBlock::defaultContent($validated['type']),
        ]);

        return $this->cors(response()->json(['data' => $block], 201));
    }

    // ── ADMIN: update a block ─────────────────────────────
    public function update(Request $request, UiBlock $uiBlock): JsonResponse
    {
        $validated = $request->validate([
            'title'   => 'sometimes|string|max:255',
            'type'    => 'sometimes|in:banner,card,list,stats',
            'status'  => 'sometimes|in:active,inactive',
            'content' => 'sometimes|array',
        ]);

        $uiBlock->update($validated);

        return $this->cors(response()->json(['data' => $uiBlock->fresh()]));
    }

    // ── ADMIN: toggle active / inactive ──────────────────
    public function toggle(UiBlock $uiBlock): JsonResponse
    {
        $uiBlock->update([
            'status' => $uiBlock->status === 'active' ? 'inactive' : 'active',
        ]);

        return $this->cors(response()->json(['data' => $uiBlock->fresh()]));
    }

    // ── ADMIN: reorder blocks ─────────────────────────────
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'orderedIds'   => 'required|array',
            'orderedIds.*' => 'integer|exists:ui_blocks,id',
        ]);

        foreach ($request->orderedIds as $position => $id) {
            UiBlock::where('id', $id)->update(['order' => $position + 1]);
        }

        $blocks = UiBlock::orderBy('order')->get();
        return $this->cors(response()->json(['data' => $blocks]));
    }

    // ── ADMIN: delete a block ─────────────────────────────
    public function destroy(UiBlock $uiBlock): JsonResponse
    {
        $uiBlock->delete();
        return $this->cors(response()->json(['message' => 'Block deleted']));
    }

    // ── OPTIONS preflight handler ─────────────────────────
    public function options(): JsonResponse
    {
        return $this->cors(response()->json([], 200));
    }
}
