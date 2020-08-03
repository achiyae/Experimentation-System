import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {judge0Key, tokenUrl} from '../../../../shared/globals';
import * as ace from 'ace-builds';
import {map} from 'rxjs/operators';

const languages2Modes: { name: string, mode: string }[] = [
  {
    name: 'Assembly (NASM 2.14.02)',
    mode: 'assembly_x86'
  },
  {
    name: 'C (Clang 7.0.1)',
    mode: 'c_cpp'
  },
  {
    name: 'C++ (Clang 7.0.1)',
    mode: 'c_cpp'
  },
  {
    name: 'C (GCC 7.4.0)',
    mode: 'c_cpp'
  },
  {
    name: 'C++ (GCC 7.4.0)',
    mode: 'c_cpp'
  },
  {
    name: 'C (GCC 8.3.0)',
    mode: 'c_cpp'
  },
  {
    name: 'C++ (GCC 8.3.0)',
    mode: 'c_cpp'
  },
  {
    name: 'C (GCC 9.2.0)',
    mode: 'c_cpp'
  },
  {
    name: 'C++ (GCC 9.2.0)',
    mode: 'c_cpp'
  },
  {
    name: 'C# (Mono 6.6.0.161)',
    mode: 'csharp'
  },
  {
    name: 'Fortran (GFortran 9.2.0)',
    mode: 'fortran'
  },
  {
    name: '',
    mode: 'html'
  },
  {
    name: 'Java (OpenJDK 13.0.1)',
    mode: 'java'
  },
  {
    name: 'JavaScript (Node.js 12.14.0)',
    mode: 'javascript'
  },
  {
    name: 'Kotlin (1.3.70)',
    mode: 'kotlin'
  },
  {
    name: 'Lua (5.3.5)',
    mode: 'lua'
  },
  {
    name: 'OCaml (4.09.0)',
    mode: 'ocaml'
  },
  {
    name: 'Pascal (FPC 3.0.4)',
    mode: 'pascal'
  },
  {
    name: 'Perl (5.28.1)',
    mode: 'perl'
  },
  {
    name: 'PHP (7.4.1)',
    mode: 'php'
  },
  {
    name: 'Prolog (GNU Prolog 1.4.5)',
    mode: 'prolog'
  },
  {
    name: 'Python (2.7.17)',
    mode: 'python'
  },
  {
    name: 'Python (3.8.1)',
    mode: 'python'
  },
  {
    name: 'Ruby (2.7.0)',
    mode: 'ruby'
  },
  {
    name: 'Scala (2.13.2)',
    mode: 'scala'
  },
  {
    name: 'TypeScript (3.7.4)',
    mode: 'typescript'
  }
];
export const aceMap: Map<string, string> = new Map();
type CodeResponseType = {
  stdout: string,
  time: number,
  memory: number,
  stderr: string,
  token: string,
  compile_output: string,
  message: string,
  status: {
    id: number,
    description: string
  }
};
const headers = new HttpHeaders({
  'X-RapidAPI-Host': 'judge0.p.rapidapi.com',
  'X-RapidAPI-Key': judge0Key
});

@Injectable({providedIn: 'root'})
export class CodeService {
  runningSubject = new Subject<CodeResponseType>();

  constructor(private http: HttpClient) {
    for (const lang2Mode of languages2Modes) {
      aceMap.set(lang2Mode.name, lang2Mode.mode);
    }
  }

  public aceRequires() {
    const reqs = [
      'ace/ext/language_tools',
      'ace/mode/php_worker',
    ];
    for (const aceMode of aceMap.values()) {
      reqs.push('ace/mode/' + aceMode + '_worker');
    }
    for (const req of reqs) {
      ace.require(req);
    }
  }

  public getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 14,
      maxLines: Infinity,
    };
    const extraEditorOptions = {enableBasicAutocompletion: true};
    return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  createCodeEditor(element: Element, options: any, language: string): ace.Ace.Editor {
    const theme = 'ace/theme/github';
    const editor = ace.edit(element, options);
    editor.setTheme(theme);
    editor.getSession().setMode(this.getLanguageString(language));
    editor.setShowFoldWidgets(true);
    return editor;
  }

  private getLanguageString(language) {
    return 'ace/mode/' + aceMap.get(language);
  }

  runCode(code: string, language: string) {
    this.getLanguages(langs => {
      let langId = 0;
      for (const lang of langs) {
        if (lang.name === language) {
          langId = lang.id;
        }
      }
      const url = tokenUrl + 'submissions/?base64_encoded=false';
      const body = {
        source_code: code,
        language_id: langId,
        redirect_stderr_to_stdout: true
      };
      this.http.post<{ token: string }>(url, body, {headers}).pipe(map(response => {
        return response.token;
      })).subscribe(token => {
        const codeUrl = tokenUrl + 'submissions/' + token + '?base64_encoded=false';
        const recursiveCheck: (response: CodeResponseType) => any = response => {
          if (response.status.id === 6) {
            alert('Compilation error');
          } else if (response.status.id !== 3) {
            setTimeout(() => {
              this.http.get<CodeResponseType>(codeUrl, {headers}).subscribe(recursiveCheck);
            }, 800);
          } else {
            this.runningSubject.next(response);
          }
        };
        this.http.get<CodeResponseType>(codeUrl, {headers}).subscribe(recursiveCheck);
      });
    });
  }

  getLanguages(continuation: (languages: { id: number, name: string }[]) => void) {
    const url = tokenUrl + 'languages';
    this.http.get<{ id: number, name: string }[]>(url, {headers}).subscribe(continuation);
  }
}
