---
title: Ghost Outside the Shell
slug: ghost-outside-the-shell
date: 2026-04-13
category: Think Notes
summary: Our research teams investigate the safety, inner workings, and societal impacts of AI models – so that artificial intelligence has a positive impact as it becomes increasingly capable.
subtitle: Why the agent's session should outlive its container
coverImage: /blogs/ghost-outside-the-shell.png
coverAlt: Ghost Outside the Shell article cover
featured: true
---

Every instance of Claude Opus is the same model. Same weights, same capabilities, same "soul." What makes your agent yours is not the model. It's the trajectory. The hours of tool calls, decisions, mistakes, and recoveries that turned a generic model into an agent that understands your codebase, remembers your last conversation, and knows what it tried an hour ago. That trajectory is the ghost. The container it runs in is the shell. And right now, for most agent systems, the ghost dies when the shell does.

Models get better fast. Really fast. Six months ago you were working around limited context windows, poor instruction following, and fragile tool use. Those problems just stop being problems. And the workarounds you built? They become dead weight.

This is the core challenge of building agent infrastructure right now: the ground is moving under your feet. If your architecture is built around today's model limitations, it'll be wrong in six months.

So the question becomes: what assumptions will still hold?

## Build on assumptions that last

Anthropic made this point well in their recent engineering post on [managed agents](https://www.anthropic.com/engineering/managed-agents). They drew an analogy to operating systems: the way OS abstractions like `read()` and `write()` outlasted every hardware generation underneath them. The interfaces stayed stable while implementations changed freely.

There's a deeper version of this lesson. In the early days of computing, there were two approaches to building a system. The Lisp Machine approach was to build the entire stack around one language, one paradigm, and optimize everything for that specific model of computation. The Unix approach was to build small, composable tools connected by stable interfaces. Pipes. Files. Processes.

Lisp Machines died out for many reasons. Cost, the AI winter, cheap commodity hardware. But one thing that kept Unix alive through decades of hardware revolutions is that its abstractions outlasted every implementation underneath them. The `read()` system call works the same whether you're accessing a 1970s disk pack or a modern NVMe SSD.

The same principle applies to agent harnesses. You need interfaces that are stable even as models change. Which means you need to figure out which abstractions are fundamental and which are just workarounds for current limitations.

## Anthropic's four primitives

In that same post, Anthropic laid out an architecture built on four of these abstractions: the session, which is the append-only log of everything that happened, the harness, which is the loop that calls the model and routes tool calls, the sandbox, where the agent runs code and edits files, and orchestration, the layer that coordinates everything.

The key insight is what's durable and what's disposable.

```
┌─────────────────────────────────────┐
│           Orchestration             │
│                                     │
│  ┌─────────────┐  ┌──────────────┐  │
│  │   Harness   │  │   Sandbox    │  │
│  │  stateless  │  │  ephemeral   │  │
│  │    loop     │  │   cattle     │  │
│  └──────┬──────┘  └──────────────┘  │
│         │                           │
│  ┌──────┴────────────────────────┐  │
│  │    Session         durable    │  │
│  │    append-only event log      │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

Sessions are durable. They're the single source of truth. Everything else is cattle. Harnesses are stateless. Sandboxes are ephemeral. If a container dies, you spin up a new one, read the session log, and continue. As they put it: "nothing in the harness needs to survive a crash."

This is the right architecture. But there's a subtlety that matters a lot for how you implement it.

## The session is not the context window

Here's something that trips up a lot of agent builders: treating the session and the context window as the same thing.

In early versions of tools like Claude Code, the session was effectively bounded by the context window. Everything the agent had done lived in the conversation history, which lived in the context window. When the window filled up, you compacted. The agent lost access to what happened before compaction. It couldn't understand decisions it had made an hour ago. It couldn't recall why it chose one approach over another.

You might think this will fix itself as context windows grow. And they are growing fast. But no matter how big the context window gets, users will always want longer sessions. An agent that runs for 8 hours generates more events than any context window can hold. And even if it could hold them all, stuffing everything into the prompt is wasteful and slow.

The solution isn't a bigger window. It's separation.

```
session:  [e1][e2][e3][e4] ··· [e49998][e49999][e50000]

context:                       [e49950] ··· [e50000]
                               ╰── harness selects ──╯
```

The session lives outside the context window, as a durable external store. The harness fetches what it needs from the session. Positional slices, filtered events, search results. Then it feeds a curated context to the model. The session grows without bound. The context window stays focused.

And you can't just selectively discard old events either. You never know which ones will matter later. The agent might need to recall a decision it made three hours ago to understand why a test is failing now. Keep everything. Retrieve intelligently.

## The session is not the sandbox

There's a second decoupling that matters just as much: session from sandbox.

Anthropic makes this explicit. Sandboxes are cattle, not pets. If a container dies, you don't nurse it back to health. You just replace it.

Your users may want to deploy harnesses in their own VPC, which means sandboxes will live on their infrastructure, possibly across different cloud providers. If your session is coupled to a specific sandbox, that doesn't work. If the session is an independent service, the sandbox can be anywhere.

## You don't need a branchable sandbox

There's a popular belief in the agent infrastructure world right now that sandboxes need to be persistent, branchable, time-travelable. That you need to snapshot the filesystem, fork it, rewind it. A lot of companies are building exactly this.

We think that's solving the wrong problem. Frontier models don't need a preserved environment. They need a preserved narrative.

```
agent running      ██████████████░░░░░░  event #144

    ⚠ sandbox killed

session:           [e1][e2] ··· [e143][e144]  ✓ intact

    new sandbox, agent reads session log

agent resumed      ████████████████░░░░  event #145
                                   ^ picks up here
```

Why can you throw away the entire execution environment and still recover? The cloned repos, the installed packages, the half-written files. All gone. And yet the agent picks up where it left off.

Because when a new container starts and the agent reads its session log, it doesn't need the exact filesystem state from before the crash. It understands "I cloned this repo, installed these dependencies, edited these files" and can recreate what it needs. The environment is a side effect of the session. The session is the source of truth.

This won't always be true. Smaller models, heavier environments, latency-sensitive scenarios where you can't afford to rebuild. In those cases, persistent filesystems still matter. But the trajectory is clear: as models get smarter, the environment becomes less precious. The session is what you protect.

## The idea is right. The question is how.

So we agree on the architecture: decouple the session from the harness, from the sandbox, and from the context window. Make it an independent, durable, append-only log that any harness can read and any sandbox can contribute to.

But agreeing on the architecture is the easy part. The hard part is building a session service that's simultaneously durable enough that events are never lost, fast enough for real-time agent workloads, searchable enough that you can actually find what you need in a 50,000-event log, cheap enough to run for hours without blowing your budget, and open enough that you're not locked into one model provider.

That's what we built.

## How Durable Sessions works

Under the hood, we're built on the [Durable Streams protocol](https://github.com/durable-streams/durable-streams/blob/main/PROTOCOL.md). It's an open, HTTP-based protocol for append-only byte streams. You append events with POST, read them with GET (catch-up, long-poll, or SSE for live tailing), and check stream state with HEAD. It's RESTful, it's HTTP, and any language that can make an HTTP request can be a client. No SDK required.

On top of the raw stream, we add session semantics. Sessions have lifecycles. You create them, start them, pause them, end them. Events are typed and structured: tool calls, model responses, user messages, errors. That structure makes them queryable. And we support full-text search with BM25 ranking across your event log, so when your harness needs to build context for the next inference call, it can search for relevant events instead of just grabbing the last N.

The API looks like what you'd expect:

```bash
# Append an event
curl -X POST https://api.tonbo.dev/sessions/my-agent/events \
  -d '{"type": "tool_call", "name": "edit_file", "data": {...}}'

# Search events
curl https://api.tonbo.dev/sessions/my-agent/events?q=auth+middleware

# Stream new events in real-time
curl https://api.tonbo.dev/sessions/my-agent/stream
```

We designed the event semantics to be familiar if you've used Claude Managed Agents. If you're already building on Anthropic's session model, the concepts map directly.

The infrastructure underneath is a distributed durable stream service that writes directly to S3. The write path goes through a 3-node quorum with synchronous replication. We do majority fsync before acknowledgment, so there's no data loss window. Recent events are served from memory for fast reads. Older events tier down to S3 for cheap storage. Append latency is around 13ms at p50 and 15ms at p95. Fast enough for real-time streaming from a running agent.

## Why not just use Anthropic Managed Agents?

If you're building Claude-only agents and want the fully managed experience, you should. Managed Agents is the most integrated solution for that use case.

But it comes with constraints. First, it only works with Claude. If you're using other models, or a mix, it's not an option. Second, your session data lives on Anthropic's infrastructure. You can't export it, query it with your own tools, or move it if you switch providers. Third, it's expensive for the session layer alone. Anthropic charges $0.08 per session-hour, which sounds cheap until you do the math: a thousand agents each running one hour a day costs about $2,400 a month in session runtime fees, before you even count tokens. The same workload on Durable Sessions costs around $18.50 a month.

The price difference exists because Anthropic's session-hour fee bundles harness execution, sandbox compute, and session storage into one charge. If you already have your own harness and sandbox, you're paying for services you don't need. We're just the session layer, priced accordingly.

The deeper difference is ownership. Every event, every tool call, every decision your agent made. It all lives in your S3 bucket. You control retention, you query it with your own tools, and you take it with you if you switch providers.

---

We are shipping this now. If you're building agent infrastructure and want early access, [book a call](https://cal.com/tzu-gwo/hi-from-tonbo) or email [contact@tonbo.io](mailto:contact@tonbo.io).
