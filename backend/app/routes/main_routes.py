# Routes for frontend viewsimport os
from flask import Blueprint, send_from_directory, current_app

main_bp = Blueprint('main', __name__)

@main_bp.route('/uploads/<filename>', methods=['GET'])
def uploaded_video(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)

@main_bp.route('/videos/<filename>', methods=['GET'])
def output_video(filename):
    return send_from_directory(current_app.config["VIDEO_FOLDER"], filename)
