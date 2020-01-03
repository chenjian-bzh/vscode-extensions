import * as vscode from 'vscode';
import * as fs from 'fs';
import { resolve } from 'path'
import config from './config.json'

const products = [
	'all',
	'ecs',
	'vod',
	'rpc',
	'livesass',
	'iam',
	'live',
	'finance',
	'auth',
	'baf',
	'message',
	'user',
	'secret',
	'imagex',
	'meet',
	'rms'
]

function createTerminals(tasks: Array<{ name: string, text: string }>): vscode.Terminal[] {
	return tasks.map(t => {
		const terminal = vscode.window.createTerminal(t.name);
		terminal.show();
		terminal.sendText(t.text);
		return terminal;
	})
}

function getWorkSpace(): vscode.WorkspaceFolder {
	const folders = vscode.workspace.workspaceFolders;

	if (!folders) throw new Error('no workspace found!')

	let index = -1;

	const vconsoleFolder = folders?.find((folder, idx) => {
		try {
			const pkg = fs.readFileSync(resolve(folder.uri.path, 'package.json')).toString();
			if (pkg) {
				if (JSON.parse(pkg).name === 'vcloud-console') {
					index = idx
					return true;
				}
			}
		} catch (e) {
			//ignore;
		}
		return false;
	});

	if (index === -1 || !vconsoleFolder) {
		throw new Error('no vconsole project in current workspace, please add at least one!')
	}
	//将vconsole移到workspace的第一位
	if (index !== 0) {
		const backup = folders[0];
		vscode.workspace.onDidChangeWorkspaceFolders(e => {
			vscode.window.showInformationMessage('vconsole project location has been moved')
		})
		vscode.workspace.updateWorkspaceFolders(0, 1, vconsoleFolder);
		vscode.workspace.updateWorkspaceFolders(folders.length, null, backup);
	}
	return vconsoleFolder;
}


function initDebugConfig(wf: vscode.WorkspaceFolder): string {

	//检测是否存在.vscode/launch.json, 没有则新建
	let missionName = 'vconsole debug'
	let configPath = `${wf.uri.path}/.vscode/launch.json`;

	if (fs.existsSync(configPath)) {
		missionName = missionName || JSON.parse(fs.readFileSync(configPath).toString()).configurations.name;
	}
	else {
		fs.writeFileSync(configPath, JSON.stringify(config));
	}

	return missionName;
}

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.vconsole.dev', () => {
			vscode.window.showQuickPick(products).then(val => {

				const wf = getWorkSpace();
				const rootpath = wf.uri.path;
				const webCommand = `yarn dev` + (val === 'all' ? '' : ` --web-module ${val}`);

				createTerminals([
					{ name: 'web', text: `cd ${rootpath}/packages/web && ${webCommand}` },
					{ name: 'platform', text: `cd ${rootpath}/packages/platform && yarn dev` }
				])
			})
		}),

		vscode.commands.registerCommand('extension.vconsole.debug', () => {
			vscode.window.showQuickPick(products).then(val => {
				const wf = getWorkSpace();
				const debugName = initDebugConfig(wf);

				createTerminals([{ name: 'web', text: `cd ${wf.uri.path}/packages/web && yarn dev --web-module ${val}` }])
				vscode.debug.startDebugging(wf, debugName)
			})
		}),

		vscode.commands.registerCommand('extension.vconsole.createDebugConfiguration', () => {
			vscode.window.showQuickPick(products).then(val => {
				try {
					const wp = getWorkSpace();
					initDebugConfig(wp);
					vscode.window.showInformationMessage('create launch.json successfully!');
				} catch (e) {
					vscode.window.showErrorMessage(`create launch.json failed, ${e.message}`)
				}
			})
		}),

		vscode.commands.registerCommand('extension.vconsole.createTopInterface', () => {
			vscode.window.showQuickPick(products).then(val => {
				//自动生成top接口文件
				vscode.window.showInformationMessage('createTopInterface');
			})
		}),

		//git commit
		vscode.commands.registerCommand('extension.vconsole.git_commit', () => {
			vscode.window.showInputBox().then(val => {
				const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
				const api = gitExtension.getAPI(1);

				vscode.window.showInformationMessage('git_commit');
			})
		}),

		vscode.commands.registerCommand('extension.vconsole.kms', () => {
			vscode.window.showInputBox().then(val => {
				//kms加密解密
				vscode.window.showInformationMessage(`kms`);
			})
		}),

		vscode.commands.registerCommand('extension.vconsole.charles', () => {
			vscode.window.showInputBox().then(val => {
				//charles代理
				vscode.window.showInformationMessage(`charles代理`);
			})
		}),
	)
}

export function deactivate() { }
