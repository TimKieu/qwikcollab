import { ViewPlugin } from '@codemirror/view';
import { getSyncedVersion, sendableUpdates } from '@codemirror/collab';
import { mapChangesToCursor } from '../../../store/CursorStore';
import { Connection } from '../../../utils/Connection';
const socket = Connection.getSocket();
export class Collab {
  public static pushing = false;

  // Inspired from https://github.com/MINERVA-MD/minerva-collab
  public static pulgin = ViewPlugin.define((view) => ({
    update(editorUpdate) {
      if (editorUpdate.docChanged) {
        const unsentUpdates = sendableUpdates(view.state).map((u) => {
          // Update cursor position of remote users on screen based on local change
          // Note that this might not update cursor position of current user (eg: cursor is one position behind the insertion change)

          mapChangesToCursor(u.changes);

          return {
            serializedUpdates: u.changes.toJSON(),
            clientID: u.clientID
          };
        });

        if (!socket.connected) {
          console.log('early return collab plugin due to offline');
          return;
        }

        if (Collab.pushing || !unsentUpdates.length) return;
        Collab.pushing = true;

        socket.emit('updateFromClient', {
          version: getSyncedVersion(view.state),
          updates: unsentUpdates,
          head: view.state.selection.main.head
        });
        Collab.pushing = false;
      }
    }
  }));
}
