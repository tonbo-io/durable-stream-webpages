---
title: Ghost Outside the Shell
slug: ghost-outside-the-shell
date: 2026-04-13
category: Think Notes
summary: Our research teams investigate the safety, inner workings, and societal impacts of AI models – so that artificial intelligence has a positive impact as it becomes increasingly capable.
subtitle: Why the agent's session should outlive its container
coverImage: /blog/ghost-outside-the-shell.png
coverAlt: Ghost Outside the Shell article cover
featured: true
---

Every instance of Claude Opus is the same model. Same weights, same capabilities, same "soul." What makes your agent yours is not the model. It's the trajectory. The hours of tool calls, decisions, mistakes, and recoveries that turned a generic model into an agent that understands your codebase, remembers your last conversation, and knows what it tried an hour ago. That trajectory is the ghost. The container it runs in is the shell. And right now, for most agent systems, the ghost dies when the shell does.

Models get better fast. Really fast. Six months ago you were working around limited context windows, poor instruction following, and fragile tool use. Those problems just stop being problems. And the workarounds you built? They become dead weight.

This is the core challenge of building agent infrastructure right now: the ground is moving under your feet. If your architecture is built around today's model limitations, it'll be wrong in six months.

So the question becomes: what assumptions will still hold?

![Ghost Outside the Shell article illustration](/blog/ghost-outside-the-shell.png)

## Build on assumptions that last

Anthropic made this point well in their recent engineering post on [managed agents](https://www.anthropic.com/engineering/managed-agents). They drew an analogy to operating systems: the way OS abstractions like `read()` and `write()` outlasted every hardware generation underneath them. The interfaces stayed stable while implementations changed freely.

There's a deeper version of this lesson. In the early days of computing, there were two approaches to building a system. The Lisp Machine approach was to build the entire stack around one language, one paradigm, and optimize everything for that specific model of computation. The Unix approach was to build small, composable tools connected by stable interfaces. Pipes. Files. Processes.

Lisp Machines died out for many reasons. Cost, the AI winter, cheap commodity hardware. But one thing that kept Unix alive through decades of hardware revolutions is that its abstractions outlasted every implementation underneath them. The `read()` system call works the same whether you're accessing a 1970s disk pack or a modern NVMe SSD.

The same principle applies to agent harnesses. You need interfaces that are stable even as models change. Which means you need to figure out which abstractions are fundamental and which are just workarounds for current limitations.

### A simple durable session example

```ts
const session = await durableSessions.resume(sessionId);

await session.run("continue investigating the flaky test");
await session.commitCheckpoint();
```
