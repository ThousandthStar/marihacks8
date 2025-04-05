import * as vscode from 'vscode';
import { ChatOllama } from "@langchain/ollama";
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

type HackIdea = {
	name: string;
	idea: string;
	description: string;
	features: string[];
	pros: string[];
	cons: string[];
}

export function activate(context: vscode.ExtensionContext) {

	dotenv.config({ path: path.join(context.extensionPath, '.env') });

	console.log('Congratulations, your extension "hackgen" is now active!');
	const disposable2 = vscode.commands.registerCommand('hackgen.wizard', () => {
		wizard(context);
	});
	context.subscriptions.push(disposable2);
}

async function wizard(context: vscode.ExtensionContext) {
	
	const panel = vscode.window.createWebviewPanel(
		'wizard', // Internal identifier for the webview
		'HackGen Wizard', // Title of the panel
		vscode.ViewColumn.One, // Editor column to show the panel in
		{ enableScripts: true } // Enable JavaScript in the webview
	);
  
	// Set the webview's HTML content
	panel.webview.html = getWebviewContent(context);

	panel.webview.onDidReceiveMessage(
	async message => {
		switch (message.command) {
		case 'alert':
			vscode.window.showInformationMessage(message.text);
			break;
		case "generate":
			for (let i = 0; i < 5; i++) {
				const result = await generate(
					message.challenge, 
					context
				);
				panel.webview.postMessage({
					command: "idea",
					index: i,
					result: result,
				});
				const details = await generateDetails(result, context);
				panel.webview.postMessage({
					command: "details",
					index: i,
					result: details,
					});
				}
			break;
		case "kickstart":
			await kickstart(message.idea, context).then(() => {;
				panel.webview.postMessage({
					command: "success",
				});
			});
			break;
		}
	},
	undefined,
	context.subscriptions
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(context: vscode.ExtensionContext) {
    const htmlPath = path.join(context.extensionPath, 'src', 'webview', 'wizard.html');
    
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    return html;
}

async function generate(challenge: string, context: vscode.ExtensionContext) {
	/*
	const apiKey = process.env.OPENAI_API_KEY;
	const ollama = new ChatOpenAI({
		model: "gpt-4o-mini",
		apiKey: apiKey,
	});
	*/
	const ollama = new ChatAnthropic({
		model: "claude-3-5-sonnet-20240620",
		apiKey: process.env.ANTHROPIC_API_KEY,
	});
	const idea_config = JSON.parse(fs.readFileSync(path.join(context.extensionPath, 'src', 'prompts', 'idea.json'), 'utf8'));

    const idea_prompt = new PromptTemplate(idea_config);

	const idea_schema = z.object({
		name: z.string().describe("The name of the hackathon idea"),
		idea: z.string().describe("The one liner description of the hackathon idea"),
		description: z.string().describe("Short description of the hackathon idea"),
	});
	const idea_chain = idea_prompt.pipe(ollama.withStructuredOutput(idea_schema));
	
	const idea_res = await idea_chain.invoke({ challenge });
	
	let result: HackIdea = {
		name: idea_res.name,
		idea: idea_res.idea,
		description: idea_res.description,
		features: [],
		pros: [],
		cons: [],
	};
	return result;
}

async function generateDetails(idea: HackIdea, context: vscode.ExtensionContext) {
	/*
	const apiKey = process.env.OPENAI_API_KEY;
	const ollama = new ChatOpenAI({
		model: "gpt-4o-mini",
		apiKey: apiKey,
	  });
	  */
	const ollama = new ChatAnthropic({
		model: "claude-3-5-sonnet-20240620",
		apiKey: process.env.ANTHROPIC_API_KEY,
	});

	const features_config = JSON.parse(fs.readFileSync(path.join(context.extensionPath, 'src', 'prompts', 'features.json'), 'utf8'));
	const pros_config = JSON.parse(fs.readFileSync(path.join(context.extensionPath, 'src', 'prompts', 'pros.json'), 'utf8'));

	const features_prompt = new PromptTemplate(features_config);
    const pros_prompt = new PromptTemplate(pros_config);

	const features_schema = z.object({
		features: z.array(z.string()).describe("A list of features for the hackathon idea"),
	});
	const pros_schema = z.object({
		pros: z.array(z.string()).describe("A list of pros for the hackathon idea"),
		cons: z.array(z.string()).describe("A list of cons for the hackathon idea"),
	});

	const features_chain = features_prompt.pipe(ollama.withStructuredOutput(features_schema));
	const pros_chain = pros_prompt.pipe(ollama.withStructuredOutput(pros_schema));

	const features_res = await features_chain.invoke({ idea: idea.idea, description: idea.description });
	const pros_res = await pros_chain.invoke({ idea: idea.idea, description: idea.description, features: features_res.features });

	let result: HackIdea = {
		name: idea.name,
		idea: idea.idea,
		description: idea.description,
		features: features_res.features,
		pros: pros_res.pros,
		cons: pros_res.cons,
	};
	return result;
}

async function kickstart(idea: HackIdea, context: vscode.ExtensionContext) {
	/*
	const apiKey = process.env.OPENAI_API_KEY;
	const ollama = new ChatOpenAI({
		model: "gpt-4o",
		apiKey: apiKey,
	});
	// use anthropic instead
	*/
	const ollama = new ChatAnthropic({
		model: "claude-3-5-sonnet-20240620",
		apiKey: process.env.ANTHROPIC_API_KEY,
	});
	
    let terminal: vscode.Terminal | undefined = vscode.window.terminals.find(t => t.name === 'HackGen');
    
    if (!terminal) {
        // Create a new terminal if none exists
        terminal = vscode.window.createTerminal('HackGen');
    }

    terminal.show();

    const terminal_command_schema = z.object({
        command: z.string().describe("The command to run, including arguments"),
    });

    const terminal_command_tool = tool(
        async ({ command }) => {
            if (terminal) {
                terminal.sendText(command);
                return `Executed command: ${command}`;
            }
            return 'Failed to execute command: terminal not found';
        },
		{
			name: "terminal_command",
			description: "Executes a command in the terminal",
			schema: terminal_command_schema,
		}
    );

	const file_create_schema = z.object({
		file_path: z.string().describe("The path to the file to create"),
		file_name: z.string().describe("The name of the file to create"),
		file_content: z.string().describe("The content of the file"),
	});

	const file_create_tool = tool(
		async ({ file_path, file_name, file_content }) => {
			const file_path_full = path.join(file_path, file_name);
			if (!fs.existsSync(file_path)) {
				fs.mkdirSync(file_path, { recursive: true });
			}
			fs.writeFileSync(file_path_full, file_content);
			return `Created file: ${file_path_full}`;
		},
		{
			name: "file_create",
			description: "Creates a file with the given content",
			schema: file_create_schema,
		}
	);

	const kickstart_config 	= JSON.parse(fs.readFileSync(path.join(context.extensionPath, 'src', 'prompts', 'kickstart.json'), 'utf8'));

	const kickstart_prompt = new PromptTemplate(kickstart_config);

	const workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
	const res = await kickstart_prompt.pipe(ollama.bindTools([terminal_command_tool, file_create_tool], { tool_choice: "any" })).invoke({ idea, path: workspace });
	if (res.tool_calls) {
		for (const command of res.tool_calls) {
			if (command.name === "terminal_command") {
				vscode.window.showInformationMessage(`Executing: ${command.args.command}`);
				terminal?.sendText(command.args.command);
			} else if (command.name === "file_create") {
				vscode.window.showInformationMessage(`Creating file: ${command.args.file_name}`);
				const file_path_full = path.join(workspace, command.args.file_path, command.args.file_name);
				if (!fs.existsSync(command.args.file_path)) {
					fs.mkdirSync(command.args.file_path, { recursive: true });
				}
				fs.writeFileSync(file_path_full, command.args.file_content);
				vscode.window.showInformationMessage(`Created file: ${file_path_full}`);
			}
		}
	}
}
